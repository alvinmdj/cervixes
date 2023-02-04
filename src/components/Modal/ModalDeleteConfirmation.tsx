import { useRef } from "react";

type Props = {
  modalId: string;
  title: string;
  onClick: () => void;
};

const ModalDeleteConfirmation = ({ modalId, title, onClick }: Props) => {
  const toggleRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    onClick();

    // close modal
    if (toggleRef.current) toggleRef.current.checked = false;
  };

  return (
    <>
      <input
        type="checkbox"
        id={modalId}
        className="modal-toggle"
        ref={toggleRef}
      />
      <label htmlFor={modalId} className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-center text-lg font-bold">{title}</h3>
          <div className="mt-4 flex gap-2">
            <label
              htmlFor={modalId}
              className="btn-ghost btn flex-1 bg-base-200"
            >
              Cancel
            </label>
            <button
              type="submit"
              className="btn-error btn flex-1"
              onClick={handleClick}
            >
              Delete
            </button>
          </div>
        </label>
      </label>
    </>
  );
};

export default ModalDeleteConfirmation;
