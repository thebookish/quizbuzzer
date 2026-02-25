import { useApp } from "@/context/AppContext";
import WaitingLobby from "./WaitingLobby";
import TopicSelectionScreen from "./TopicSelectionScreen";
import BuzzerInterface from "./BuzzerInterface";

export default function TeamPortal() {
  const { currentRound } = useApp();

  if (!currentRound || currentRound.state === "waiting") {
    return <WaitingLobby />;
  }

  if (currentRound.state === "topic_selection" && currentRound.topic_selection_active) {
    return <TopicSelectionScreen />;
  }

  if (currentRound.state === "active" || currentRound.buzzers_active) {
    return <BuzzerInterface />;
  }

  return <WaitingLobby />;
}
