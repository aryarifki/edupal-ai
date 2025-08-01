import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo teacher
  const teacher = await prisma.user.create({
    data: {
      email: 'teacher@edupal.ai',
      name: 'Dr. Sarah Johnson',
      role: 'TEACHER',
      teacherProfile: {
        create: {
          school: 'EduPal High School',
          department: 'Mathematics & Science',
          subjects: ['Mathematics', 'Physics', 'Chemistry'],
        },
      },
    },
  });

  console.log('✅ Created teacher:', teacher.email);

  // Create demo classroom
  const classroom = await prisma.classroom.create({
    data: {
      name: 'Advanced Mathematics',
      subject: 'Mathematics',
      grade: '11',
      code: 'MATH11A',
      teacherId: teacher.teacherProfile.id,
    },
  });

  console.log('✅ Created classroom:', classroom.name);

  // Create 30 demo students
  const students = [];
  const firstNames = [
    'Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Avery', 'Jamie', 'Quinn',
    'Blake', 'Cameron', 'Morgan', 'Sage', 'River', 'Skylar', 'Dakota', 'Emery',
    'Finley', 'Hayden', 'Kendall', 'Logan', 'Peyton', 'Reese', 'Rowan', 'Sam',
    'Sidney', 'Tanner', 'Teagan', 'Phoenix', 'Remy', 'Marlowe'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
  ];

  for (let i = 0; i < 30; i++) {
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.edupal.ai`;

    const student = await prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        role: 'STUDENT',
        studentProfile: {
          create: {
            grade: '11',
            school: 'EduPal High School',
            subjects: ['Mathematics', 'Physics', 'Chemistry'],
            preferences: {
              learningStyle: ['visual', 'kinesthetic', 'auditory'][Math.floor(Math.random() * 3)],
              difficultyPreference: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
              subjects: ['Mathematics', 'Physics', 'Chemistry'],
            },
          },
        },
      },
    });

    // Add student to classroom
    await prisma.classroomStudent.create({
      data: {
        classroomId: classroom.id,
        studentId: student.studentProfile.id,
      },
    });

    students.push(student);

    // Create some progress data for each student
    const mathConcepts = ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry'];
    const physicsConcepts = ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Quantum Physics'];
    const chemistryConcepts = ['Atomic Structure', 'Chemical Bonding', 'Stoichiometry', 'Thermochemistry', 'Organic Chemistry'];

    for (const subject of ['Mathematics', 'Physics', 'Chemistry']) {
      const concepts = subject === 'Mathematics' ? mathConcepts : 
                     subject === 'Physics' ? physicsConcepts : chemistryConcepts;
      
      for (const concept of concepts) {
        await prisma.studentProgress.create({
          data: {
            studentId: student.studentProfile.id,
            subject,
            concept,
            masteryLevel: Math.random(),
            practiceCount: Math.floor(Math.random() * 50),
            lastPracticed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            weakAreas: Math.random() > 0.7 ? [concept] : [],
          },
        });
      }
    }
  }

  console.log(`✅ Created ${students.length} students`);

  // Create sample rubrics
  const mathRubric = await prisma.rubric.create({
    data: {
      name: 'Mathematics Problem Solving',
      subject: 'Mathematics',
      teacherId: teacher.teacherProfile.id,
      isDefault: true,
      criteria: {
        criteria: [
          {
            name: 'Mathematical Understanding',
            weight: 0.3,
            levels: [
              { score: 4, description: 'Demonstrates complete understanding of mathematical concepts' },
              { score: 3, description: 'Shows substantial understanding with minor gaps' },
              { score: 2, description: 'Shows partial understanding with some misconceptions' },
              { score: 1, description: 'Shows minimal understanding with major misconceptions' },
            ],
          },
          {
            name: 'Problem Solving Strategy',
            weight: 0.25,
            levels: [
              { score: 4, description: 'Uses efficient and sophisticated strategy' },
              { score: 3, description: 'Uses appropriate strategy with minor inefficiencies' },
              { score: 2, description: 'Uses partially appropriate strategy' },
              { score: 1, description: 'Uses inappropriate or no clear strategy' },
            ],
          },
          {
            name: 'Mathematical Communication',
            weight: 0.25,
            levels: [
              { score: 4, description: 'Clear, precise, and complete mathematical language' },
              { score: 3, description: 'Generally clear with minor communication issues' },
              { score: 2, description: 'Somewhat clear but lacks precision' },
              { score: 1, description: 'Unclear or inadequate communication' },
            ],
          },
          {
            name: 'Accuracy',
            weight: 0.2,
            levels: [
              { score: 4, description: 'All calculations and final answer are correct' },
              { score: 3, description: 'Minor computational errors with correct method' },
              { score: 2, description: 'Some computational errors affecting the solution' },
              { score: 1, description: 'Major errors in calculations or final answer' },
            ],
          },
        ],
        totalPoints: 100,
      },
    },
  });

  console.log('✅ Created mathematics rubric');

  // Create sample assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Quadratic Functions and Applications',
      description: 'Solve various quadratic function problems and analyze their real-world applications.',
      subject: 'Mathematics',
      totalPoints: 100,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      classroomId: classroom.id,
      createdById: teacher.id,
      rubricId: mathRubric.id,
      isPublished: true,
    },
  });

  // Create assignment problems
  await prisma.assignmentProblem.createMany({
    data: [
      {
        assignmentId: assignment1.id,
        problemText: 'Find the vertex and axis of symmetry for the quadratic function f(x) = 2x² - 8x + 6',
        maxPoints: 25,
        order: 1,
      },
      {
        assignmentId: assignment1.id,
        problemText: 'A ball is thrown upward with an initial velocity of 48 ft/s from a height of 8 feet. The height h(t) = -16t² + 48t + 8. Find when the ball hits the ground.',
        maxPoints: 30,
        order: 2,
      },
      {
        assignmentId: assignment1.id,
        problemText: 'Graph the quadratic function f(x) = x² - 4x + 3 and identify its key features.',
        maxPoints: 25,
        order: 3,
      },
      {
        assignmentId: assignment1.id,
        problemText: 'Solve the quadratic equation 3x² - 5x - 2 = 0 using the quadratic formula.',
        maxPoints: 20,
        order: 4,
      },
    ],
  });

  console.log('✅ Created sample assignment with problems');

  // Create some sample submissions
  for (let i = 0; i < 10; i++) {
    const student = students[i];
    const submission = await prisma.submission.create({
      data: {
        assignmentId: assignment1.id,
        studentId: student.id,
        status: 'GRADED',
        totalScore: 70 + Math.random() * 30, // Random score between 70-100
        feedback: 'Good work overall. Pay attention to calculation accuracy and show more detailed steps.',
        submittedAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
        gradedAt: new Date(),
      },
    });

    console.log(`✅ Created submission for ${student.name}`);
  }

  // Create sample quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Algebra Fundamentals',
      subject: 'Mathematics',
      difficulty: 'MEDIUM',
      timeLimit: 30,
      questions: {
        questions: [
          {
            id: 1,
            question: 'Solve for x: 2x + 5 = 13',
            options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
            correct: 0,
            explanation: '2x + 5 = 13, so 2x = 8, therefore x = 4',
            concepts: ['Linear Equations'],
          },
          {
            id: 2,
            question: 'What is the slope of the line y = 3x - 7?',
            options: ['3', '-7', '3/7', '-3'],
            correct: 0,
            explanation: 'In the form y = mx + b, m is the slope, so the slope is 3',
            concepts: ['Linear Functions'],
          },
          {
            id: 3,
            question: 'Factor: x² - 9',
            options: ['(x - 3)(x + 3)', '(x - 9)(x + 1)', '(x + 3)²', '(x - 3)²'],
            correct: 0,
            explanation: 'This is a difference of squares: x² - 9 = x² - 3² = (x - 3)(x + 3)',
            concepts: ['Factoring'],
          },
        ],
      },
    },
  });

  // Create some quiz attempts
  for (let i = 0; i < 15; i++) {
    const student = students[i];
    await prisma.quizAttempt.create({
      data: {
        quizId: quiz1.id,
        studentId: student.id,
        answers: {
          1: Math.floor(Math.random() * 4),
          2: Math.floor(Math.random() * 4),
          3: Math.floor(Math.random() * 4),
        },
        score: 60 + Math.random() * 40, // Random score 60-100
        maxScore: 100,
        timeSpent: 15 + Math.floor(Math.random() * 20), // 15-35 minutes
        completedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('✅ Created sample quiz and attempts');

  // Create sample notifications
  const notificationMessages = [
    'New assignment "Quadratic Functions" has been posted',
    'Quiz "Algebra Fundamentals" scores are now available',
    'Your submission has been graded',
    'Reminder: Assignment due tomorrow',
    'New study material available for Calculus',
  ];

  for (let i = 0; i < 20; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const message = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
    
    await prisma.notification.create({
      data: {
        userId: student.id,
        type: ['ASSIGNMENT_GRADED', 'NEW_ASSIGNMENT', 'QUIZ_COMPLETED', 'PROGRESS_UPDATE'][Math.floor(Math.random() * 4)],
        title: 'EduPal AI Notification',
        message,
        isRead: Math.random() > 0.3, // 70% read
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('✅ Created sample notifications');

  console.log('🎉 Database seed completed successfully!');
  console.log('');
  console.log('Demo accounts created:');
  console.log('Teacher: teacher@edupal.ai');
  console.log('Students: firstname.lastname@student.edupal.ai (30 students)');
  console.log('');
  console.log('Demo data includes:');
  console.log('- 1 classroom with 30 students');
  console.log('- 1 assignment with 4 problems');
  console.log('- 10 student submissions');
  console.log('- 1 quiz with 15 attempts');
  console.log('- Student progress tracking data');
  console.log('- 20 sample notifications');
  console.log('- Default grading rubrics');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });