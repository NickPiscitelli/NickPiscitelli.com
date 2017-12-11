// Welcome!
// I'm Nick Piscitelli (Picky Knee) and this my website!
// Check out the source code on the right!
// Check out my full resume at:
// E-mail Address: mail@nickpiscitelli.com

// Who am I?
var pickyKnee = new Person({
  firstName: "Nicholas",
  lastName: "Piscitelli",
  middleInitial: "C"
});

pickyKnee.setOccupation("Full Stack Web Developer");

pickyKnee.setObjective("Obtain a challenging and motivating position.")

pickyKnee.setLanguages([
  {
    name: "JavaScript",
    mastery: "Ninja",
    experience: new Years(7)
  },
  {
    name: "Perl",
    mastery: "Monk",
    experience: new Years(9)
  },
  {
    name: "PHP",
    mastery: "Reluctant Assassin",
    experience: new Years(9)
  },
  {
    name: "Node.js",
    mastery: "Aspiring Warrior",
    experience: new Years(4)
  },
  {
    name: "C#",
    mastery: "Rusty Anchor",
    experience: new Years(11)
  }
]);

pickyKnee.setOperatingSystems([
  "Linux",
  "Windows",
  "Android",
  "Mac OSX",
  "iOS"
])

pickyKnee.setDataStores([
  "MySQL",
  "SQL Server",
  "SQLite",
  "Memcache",
  "Redis",
  "MongoDB"
]);

pickyKnee.setHobbies([
  "Reading",
  "Learning",
  "Digital Currencies",
  "Clash Royale",
  "Working Out",
  "Playing with my dogs"
]);

pickyKnee.run();