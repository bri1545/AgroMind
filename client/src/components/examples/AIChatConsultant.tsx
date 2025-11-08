import AIChatConsultant from "../AIChatConsultant";

export default function AIChatConsultantExample() {
  return (
    <AIChatConsultant
      onSendMessage={(message) => console.log("Message sent:", message)}
    />
  );
}
