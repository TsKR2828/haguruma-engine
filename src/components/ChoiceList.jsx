export default function ChoiceList({ choices, onSelect }) {
  if (!choices || choices.length === 0) return null;
  return (
    <div className="choice-list">
      {choices.map((choice, i) => (
        <button
          key={i}
          className="choice-btn"
          onClick={() => onSelect(choice)}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
}
