export interface LastMessage {
  author: string;
  text: string;
  time: string;
}

export interface Member {
  name: string;
  avatarUrl: string;
}

export interface Chat {
  id: number;
  title: string;
  avatarUrl: string;
  alt: string;
  unreadCount: number;
  lastMessage: LastMessage;
  member: Member;
}

export const chats: Chat[] = [
  {
    id: 1,
    title: "Приветственный чат",
    avatarUrl: "https://placehold.co/64/lightgrey/lightgrey/png",
    alt: "Аватар приветственного чата",
    unreadCount: 2,
    lastMessage: {
      author: "Бот",
      text: "Добро пожаловать!",
      time: "09:20",
    },
    member: {
      name: "Бот",
      avatarUrl: "https://placehold.co/64/lightpink/lightpink/png",
    },
  },
  {
    id: 2,
    title: "Frontend Crew",
    avatarUrl: "https://placehold.co/64/lightgrey/lightgrey/png",
    alt: "Аватар чата Frontend Crew",
    unreadCount: 0,
    lastMessage: {
      author: "Катя",
      text: "Код-ревью в пн?",
      time: "18:05",
    },
    member: {
      name: "Катя",
      avatarUrl: "https://placehold.co/64/lightblue/lightblue/png",
    },
  },
  {
    id: 3,
    title: "Frontend Crew",
    avatarUrl: "https://placehold.co/64/lightgrey/lightgrey/png",
    alt: "Аватар чата Frontend Crew",
    unreadCount: 1,
    lastMessage: {
      author: "Витя",
      text: "Код-ревью в вт?",
      time: "18:05",
    },
    member: {
      name: "Витя",
      avatarUrl: "https://placehold.co/64/lightgreen/lightgreen/png",
    },
  },
  {
    id: 4,
    title: "Frontend Crew",
    avatarUrl: "https://placehold.co/64/lightgrey/lightgrey/png",
    alt: "Аватар чата Frontend Crew",
    unreadCount: 3,
    lastMessage: {
      author: "Аня",
      text: "Код-ревью в ср?",
      time: "18:05",
    },
    member: {
      name: "Аня",
      avatarUrl: "https://placehold.co/64/lightsalmon/lightsalmon/png",
    },
  },
  {
    id: 5,
    title: "Frontend Crew",
    avatarUrl: "https://placehold.co/64/lightgrey/lightgrey/png",
    alt: "Аватар чата Frontend Crew",
    unreadCount: 0,
    lastMessage: {
      author: "Лёша",
      text: "Код-ревью в четверг?",
      time: "18:05",
    },
    member: {
      name: "Лёша",
      avatarUrl: "https://placehold.co/64/lightseagreen/lightseagreen/png",
    },
  },
];
