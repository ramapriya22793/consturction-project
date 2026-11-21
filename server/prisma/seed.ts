import { PrismaClient, Role, ProjectStatus, TaskStatus, TaskPriority } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Civil Engineering initial data...");

  // Seed Users with RBAC
  const admin = await prisma.user.upsert({
    where: { email: "admin@civilcorp.com" },
    update: {},
    create: {
      email: "admin@civilcorp.com",
      name: "Alex Vance (Director)",
      role: Role.ADMIN,
    },
  });

  const pm = await prisma.user.upsert({
    where: { email: "pm@civilcorp.com" },
    update: {},
    create: {
      email: "pm@civilcorp.com",
      name: "Sarah Chen (Project Manager)",
      role: Role.PROJECT_MANAGER,
    },
  });

  const engineer = await prisma.user.upsert({
    where: { email: "engineer@civilcorp.com" },
    update: {},
    create: {
      email: "engineer@civilcorp.com",
      name: "Marcus Miller (Site Engineer)",
      role: Role.SITE_ENGINEER,
    },
  });

  // Seed Projects
  const project1 = await prisma.project.upsert({
    where: { code: "PRJ-METRO-01" },
    update: {},
    create: {
      code: "PRJ-METRO-01",
      name: "Metro Viaduct & Station Expansion",
      description: "Elevated transit viaduct structure and 4 intermodal civil stations.",
      location: "Sector 14 - Highway Junction",
      budget: 15400000.0,
      spent: 4250000.0,
      status: ProjectStatus.IN_PROGRESS,
      clientName: "State Metro Rail Corp",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2027-12-30"),
    },
  });

  const project2 = await prisma.project.upsert({
    where: { code: "PRJ-RES-TOWER" },
    update: {},
    create: {
      code: "PRJ-RES-TOWER",
      name: "Apex Sky Commercial & Residential Complex",
      description: "32-story reinforced concrete mixed-use tower with dual basements.",
      location: "Downtown Central Avenue",
      budget: 28500000.0,
      spent: 8900000.0,
      status: ProjectStatus.IN_PROGRESS,
      clientName: "Apex Urban Properties",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2028-03-31"),
    },
  });

  // Seed Tasks
  await prisma.task.createMany({
    data: [
      {
        projectId: project1.id,
        title: "Foundation Pier Piling & Bored Wells (Piers 12-18)",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        assignedToId: engineer.id,
        dueDate: new Date("2026-12-15"),
      },
      {
        projectId: project1.id,
        title: "Structural Steel Girder Fabrication Quality Inspection",
        status: TaskStatus.TODO,
        priority: TaskPriority.URGENT,
        assignedToId: pm.id,
        dueDate: new Date("2026-11-30"),
      },
      {
        projectId: project2.id,
        title: "Basement 2 Diaphragm Wall Concrete Curing & Testing",
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        assignedToId: engineer.id,
        dueDate: new Date("2026-11-10"),
      },
    ],
    skipDuplicates: true,
  });

  // Seed Materials
  await prisma.material.createMany({
    data: [
      {
        projectId: project1.id,
        name: "Ready-Mix Concrete Grade M40",
        category: "Concrete",
        quantity: 1200,
        unit: "m³",
        unitPrice: 110,
        totalCost: 132000,
        supplier: "Holcim Cement & Aggregates",
        status: "DELIVERED",
      },
      {
        projectId: project1.id,
        name: "Fe500D TMT Reinforcement Steel Bars (16mm & 25mm)",
        category: "Steel",
        quantity: 250,
        unit: "Metric Tonnes",
        unitPrice: 750,
        totalCost: 187500,
        supplier: "ArcelorMittal Infrastructure",
        status: "DELIVERED",
      },
      {
        projectId: project2.id,
        name: "High Tensile Pre-stressing Strands",
        category: "Steel",
        quantity: 60,
        unit: "Metric Tonnes",
        unitPrice: 1250,
        totalCost: 75000,
        supplier: "Nippon Steel Corp",
        status: "ORDERED",
      },
    ],
    skipDuplicates: true,
  });

  // Seed Daily Report
  await prisma.dailyReport.create({
    data: {
      projectId: project1.id,
      authorId: engineer.id,
      weather: "Sunny / 28°C",
      workforceCount: 84,
      equipmentOnSite: "3x Hydraulic Rotary Rigs, 2x 50-Ton Cranes, 6x Transit Mixers",
      workSummary: "Completed concrete pour for Pier Cap P14. Total volume 180 m³. Curing tests for Pier P12 passed 28-day 45MPa strength verification.",
      issuesDelays: "Minor delay of 45 mins due to municipal concrete transit truck detour during peak morning traffic.",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
