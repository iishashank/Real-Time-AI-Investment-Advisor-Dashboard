import { useState } from 'react';
import {
  Typography,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';

interface Question {
  id: number;
  text: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: 'What is your investment time horizon?',
    options: [
      { value: 'short', label: 'Less than 2 years', score: 1 },
      { value: 'medium', label: '2-5 years', score: 2 },
      { value: 'long', label: 'More than 5 years', score: 3 },
    ],
  },
  {
    id: 2,
    text: 'How would you react to a 20% drop in your investment value?',
    options: [
      { value: 'sell', label: 'Sell immediately to prevent further losses', score: 1 },
      { value: 'wait', label: 'Wait and see before making a decision', score: 2 },
      { value: 'buy', label: 'Buy more at lower prices', score: 3 },
    ],
  },
  {
    id: 3,
    text: 'What percentage of your total savings are you planning to invest?',
    options: [
      { value: 'conservative', label: 'Less than 25%', score: 1 },
      { value: 'moderate', label: '25-50%', score: 2 },
      { value: 'aggressive', label: 'More than 50%', score: 3 },
    ],
  },
];

export default function Risk() {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [calculating, setCalculating] = useState(false);
  const [riskScore, setRiskScore] = useState<number | null>(null);

  const handleNext = () => {
    if (activeStep === questions.length - 1) {
      calculateRiskProfile();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateRiskProfile = async () => {
    setCalculating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const totalScore = questions.reduce((acc, question) => {
      const answer = answers[question.id];
      const option = question.options.find((opt) => opt.value === answer);
      return acc + (option?.score || 0);
    }, 0);

    const maxPossibleScore = questions.length * 3;
    const normalizedScore = (totalScore / maxPossibleScore) * 100;
    setRiskScore(Math.round(normalizedScore));
    setCalculating(false);
  };

  const getRiskLevel = (score: number) => {
    if (score < 40) return { level: 'Conservative', color: '#2196f3' };
    if (score < 70) return { level: 'Moderate', color: '#ff9800' };
    return { level: 'Aggressive', color: '#f44336' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" gutterBottom>
        Risk Profile Assessment
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        {riskScore === null ? (
          <>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {questions.map((_, index) => (
                <Step key={index}>
                  <StepLabel>Question {index + 1}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mb: 4 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  {questions[activeStep].text}
                </FormLabel>
                <RadioGroup
                  value={answers[questions[activeStep].id] || ''}
                  onChange={(e) => handleAnswer(questions[activeStep].id, e.target.value)}
                >
                  {questions[activeStep].options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!answers[questions[activeStep].id]}
              >
                {activeStep === questions.length - 1 ? 'Calculate' : 'Next'}
              </Button>
            </Box>
          </>
        ) : calculating ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Your Risk Profile
            </Typography>
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                mb: 2
              }}
            >
              <CircularProgress
                variant="determinate"
                value={riskScore}
                size={120}
                thickness={4}
                sx={{ color: getRiskLevel(riskScore).color }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" component="div">
                  {riskScore}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" color={getRiskLevel(riskScore).color}>
              {getRiskLevel(riskScore).level} Investor
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setActiveStep(0);
                setAnswers({});
                setRiskScore(null);
              }}
              sx={{ mt: 3 }}
            >
              Retake Assessment
            </Button>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
}