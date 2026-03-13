import { Scent } from '../data/scents';

interface Props {
  scent: Scent;
  onClick: () => void;
  disabled?: boolean;
}

export default function ScentButton({ scent, onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center p-4 rounded-lg shadow ${scent.color} hover:scale-105 transition disabled:opacity-50`}
    >
      {scent.name}
    </button>
  );
}
