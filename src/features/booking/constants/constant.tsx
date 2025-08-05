
export const roomData: any[] = [
  {
    id: "mcc",
    building: "Millennium Centennial Center",
    room: [
      {
        id: "sumatera",
        name: "Sumatera",
        floor: "17",
        capacity: "Medium"
      },
      {
        id: "sulawesi",
        name: "Sulawesi",
        floor: "17",
        capacity: "Small",
      },
      {
        id: "jawa",
        name: "Jawa",
        floor: "17",
        capacity: "Small",
      },
      {
        id: "papua",
        name: "Papua",
        floor: "17",
        capacity: "Large",
      },
      {
        id: "kalimantan",
        name: "Kalimantan",
        floor: "17",
        capacity: "Medium",
      },
    ]
  },
  {
    id: "santana",
    building: "Wisma Nugra Santana",
    room: [
      {
        id: "mb-1",
        name: "Meeting Besar 1",
        floor: "3A",
        capacity: "Large",
      },
      {
        id: "mb-2",
        name: "Meeting Besar 2",
        floor: "3A",
        capacity: "Large",
      },
      {
        id: "rinjani",
        name: "Rinjani",
        floor: "6",
        capacity: "Large",
      },
      {
        id: "merbabu",
        name: "Merbabu",
        floor: "6",
        capacity: "Small",
      },
      {
        id: "kerinci",
        name: "Kerinci",
        floor: "6",
        capacity: "Small",
      },
    ]
  },
];

export const category = [
  { 
    value: "booking-room", 
    label: "Booking Room",
    subCategory: [
      { value: "br-request", label: "Booking Room Request"}
    ]
  }
]

export const contactTypeOptions = [
  { value: "contact", label: "Whatsapp" },
  { value: "email", label: "Email" }
]