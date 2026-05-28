// ─────────────────────────────────────────────────────────────
//  CLIENT CONFIG — edit this file for each new client deployment
//  Images: drop files into /public/ and reference by filename
// ─────────────────────────────────────────────────────────────

export const clientConfig = {
  // ── Participant-facing app name ──────────────────────────────
  appName: 'SkillApply AI',

  // ── Training details ─────────────────────────────────────────
  trainingName: 'Customer Communication & Soft Skills',
  trainingDate: '24 May 2025',
  clientCompanyName: 'Jyothi CNC Machines',

  // ── Trainer details ──────────────────────────────────────────
  trainerName: 'Krishna',
  trainerTitle: 'Senior Trainer, GrowthAspire',
  trainerPhoto: '/trainer-photo.jpg',   // place file in /public/

  // ── Logos (place files in /public/) ──────────────────────────
  growthAspireLogo: '/growthaspire-logo.png',
  clientLogo: '/client-logo.png',

  // ── Welcome message (supports line breaks with \n) ───────────
  welcomeMessage: `Welcome, Jyothi CNC Participants!

This is your Trainer Krishna here. As you have completed the training, it is time to also practice in the field. With this portal you can now access me virtually.

You can select a situation you are facing and get the training that applies to that — or share your current situation to explore what can be done.

Hope you can make the best use of this and provide your feedback to help me improve it. Best wishes for applying your training in the field.`,

  // ── Participant page subtitle ────────────────────────────────
  pageSubtitle: 'Select your situation, add context, and get guidance based on your training.',
}
