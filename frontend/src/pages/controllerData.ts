export const controllerStations = [
  "Delhi Central",
  "Mumbai Central",
  "Chennai Central",
  "Kolkata Central",
  "Bangalore City",
  "Hyderabad",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Ahmedabad",
];

export const controllerTrains = [
  { number: "12001", name: "Rajdhani Express", currentLocation: "Near Delhi Central", delayMins: 3, status: "On Time" as const, station: "Delhi Central", passengers: 420, confidence: 95 },
  { number: "12012", name: "Shatabdi Express", currentLocation: "Approaching Mumbai Central", delayMins: 18, status: "Delayed" as const, station: "Mumbai Central", passengers: 310, confidence: 88 },
  { number: "12657", name: "Mysore Express", currentLocation: "Near Chennai Central", delayMins: 22, status: "Delayed" as const, station: "Chennai Central", passengers: 278, confidence: 84 },
  { number: "12345", name: "Intercity Express", currentLocation: "Delhi - Jaipur section", delayMins: 0, status: "On Time" as const, station: "Delhi Central", passengers: 192, confidence: 97 },
  { number: "12904", name: "Golden Temple Mail", currentLocation: "Near Lucknow", delayMins: 41, status: "Critical" as const, station: "Lucknow", passengers: 506, confidence: 91 },
];

export const controllerAlerts = [
  { id: "a1", message: "Train 12345 delayed by 25 mins", severity: "warning" as const, time: "2 min ago" },
  { id: "a2", message: "Heavy fog detected near Kanpur corridor", severity: "critical" as const, time: "5 min ago" },
  { id: "a3", message: "Signal restored at Jaipur junction", severity: "info" as const, time: "11 min ago" },
];

export const controllerComplaints = [
  { id: "c1", trainNumber: "12012", category: "Seat", message: "Coach B2 seat 41 fan not working", status: "Open", createdAt: "10:14 AM" },
  { id: "c2", trainNumber: "12904", category: "Safety", message: "Door lock issue in S4", status: "Escalated", createdAt: "09:52 AM" },
  { id: "c3", trainNumber: "12345", category: "Cleanliness", message: "Washroom requires urgent cleaning", status: "In Progress", createdAt: "09:10 AM" },
  { id: "c4", trainNumber: "12001", category: "Service", message: "Pantry delivery delayed", status: "Resolved", createdAt: "08:41 AM" },
];
