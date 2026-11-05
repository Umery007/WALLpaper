import wallpaper from "../../assets/img-cards/paper.jpeg";

export const initialNotifications = [
  {
    id: "like",
    icon: "heart",
    title: "Seu wallpaper recebeu uma curtida.",
    description: "Alguém gostou da sua criação na comunidade.",
    time: "há 5 min",
    image: wallpaper,
    read: false,
  },
  {
    id: "generated",
    icon: "generated",
    title: "Seu novo wallpaper foi gerado com IA.",
    description: "Sua criação está pronta para visualizar e baixar.",
    time: "há 1 h",
    image: wallpaper,
    read: false,
  },
  {
    id: "comment",
    icon: "message",
    title: "Você recebeu um novo comentário.",
    description: "Uma pessoa comentou em um wallpaper seu.",
    time: "há 3 h",
    image: wallpaper,
    read: true,
  },
  {
    id: "vip",
    icon: "crown",
    title: "Seu plano VIP está ativo.",
    description: "Aproveite seus recursos e continue criando.",
    time: "ontem",
    image: wallpaper,
    read: true,
  },
];
