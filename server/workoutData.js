// Server-side workout data (mirrors client src/data/workouts.js)
const WORKOUTS = {
  0: { day: 'Sunday', name: 'Push Day', type: 'Strength', calBurn: '320–380 kcal',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8–10' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10–12' },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10–12' },
      { name: 'Cable Lateral Raises', sets: 3, reps: '15' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12–15' },
      { name: 'Plank', sets: 3, reps: '45–60 sec' },
    ]},
  1: { day: 'Monday', name: 'HIIT Fat Burn', type: 'HIIT Cardio', calBurn: '420–500 kcal',
    exercises: [
      { name: 'Tabata Treadmill Sprints', sets: 1, reps: '8×20s' },
      { name: 'Tabata Burpees', sets: 1, reps: '8×20s' },
      { name: 'Tabata Mountain Climbers', sets: 1, reps: '8×20s' },
      { name: 'Tabata Jump Squats', sets: 1, reps: '8×20s' },
      { name: 'Hanging Leg Raises', sets: 3, reps: '12' },
    ]},
  2: { day: 'Tuesday', name: 'Pull Day', type: 'Strength', calBurn: '300–360 kcal',
    exercises: [
      { name: 'Barbell Bent-Over Rows', sets: 4, reps: '8–10' },
      { name: 'Lat Pulldowns', sets: 3, reps: '10–12' },
      { name: 'Seated Cable Rows', sets: 3, reps: '10–12' },
      { name: 'Face Pulls', sets: 3, reps: '15' },
      { name: 'Barbell Curls', sets: 3, reps: '10–12' },
    ]},
  3: { day: 'Wednesday', name: 'Cardio Fat Burn', type: 'Cardio', calBurn: '380–440 kcal',
    exercises: [
      { name: 'Treadmill Intervals', sets: 10, reps: '1min fast/1min walk' },
      { name: 'Elliptical Steady State', sets: 1, reps: '15 min' },
      { name: 'Bike Sprints', sets: 5, reps: '30s hard/30s easy' },
      { name: 'Plank Hold', sets: 3, reps: '60–90 sec' },
    ]},
  4: { day: 'Thursday', name: 'LEGS DAY', type: 'Strength', calBurn: '400–480 kcal',
    exercises: [
      { name: 'Back Squats', sets: 4, reps: '8–10' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '10–12' },
      { name: 'Leg Press', sets: 3, reps: '12–15' },
      { name: 'Walking Lunges', sets: 3, reps: '10 each leg' },
      { name: 'Leg Curls', sets: 3, reps: '12' },
      { name: 'Jump Squats', sets: 3, reps: '15' },
    ]},
  5: { day: 'Friday', name: 'Rest Day', type: 'Rest', calBurn: '—', exercises: [] },
  6: { day: 'Saturday', name: 'Active Recovery', type: 'Recovery', calBurn: '150–200 kcal',
    exercises: [
      { name: 'Outdoor Walk', sets: 1, reps: '30–45 min' },
      { name: 'Foam Rolling', sets: 1, reps: '10 min' },
      { name: 'Full Body Stretching', sets: 1, reps: '15–20 min' },
    ]},
};

module.exports = WORKOUTS;
