import ColorSelectorNode from "./ColorSelectorNode";
import InputNode from "./InputNode";
import PromptInputNode from "./PromptInputNode";
import VideoDisplayNode from "./VideoDisplayNode";

export const initBgColor = "#c9f1dd";
export const snapGrid = [20, 20];
export const nodeTypes = {
  selectorNode: ColorSelectorNode,
  inputNode: InputNode,
  promptInput: PromptInputNode,
  videoDisplay: VideoDisplayNode,
};

export const defaultViewport = { x: 0, y: 0, zoom: 1.0 };

// Frases engraçadas
export const funnyTemplates = [
  (input) =>
    `Você disse "${input}"? Isso é mais engraçado que meu saldo bancário! 😂`,
  (input) =>
    `Novo estudo revela: quem fala "${input}" tem 80% mais chance de tropeçar no próprio ego.`,
  (input) =>
    `Se "${input}" fosse uma comida, com certeza seria miojo gourmetizado.`,
  (input) =>
    `"${input}" é o nome do meu novo álbum de sofrência eletrônica. 🎧💔`,
  (input) =>
    `Breaking news: "${input}" vai substituir o Wi-Fi na casa da sua avó.`,
];
