import type { OptionType } from "pages/diagnose";

const ModalDiagnoseResult = ({
  result,
  openResultModal,
  handleCloseResultModal,
}: {
  result: OptionType[];
  openResultModal: boolean;
  handleCloseResultModal: () => void;
}) => {
  let highest: OptionType = {
    id: "",
    name: "",
    diseases: [],
    weight: 0,
  };
  let disease = "Tidak terdiagnosis kanker serviks";

  if (result.length) {
    highest = result.reduce((prev, current) => {
      return prev.weight > current.weight ? prev : current;
    });

    if (highest.diseases.length) {
      disease = highest.diseases.join(", ");
    }
  }

  return (
    <>
      <input
        type="checkbox"
        id="my-modal-5"
        className="modal-toggle"
        checked={openResultModal}
        onChange={() => {
          return;
        }}
      />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="mb-3 text-center text-2xl font-bold">
            Hasil Diagnosis
          </h3>
          <div className="mb-3">
            <p className="text-lg font-bold">Keterangan</p>
            {result.length !== 0 && (
              <>
                <p>{JSON.stringify(result)}</p>
                <p>Highest prob: {JSON.stringify(highest)}</p>
                <p>Highest prob disease: {disease}</p>
              </>
            )}
          </div>

          <div className="mb-3">
            {/* if symptoms still happening, try: consult with real doctor, do a screening test, etc. */}
            <p className="text-lg font-bold">Hal yang dapat Anda lakukan</p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat
              dignissimos illo molestias eligendi veritatis commodi amet maxime
              in ipsam a? Cum perferendis dolorum ex magnam adipisci soluta,
              corrupti odit laudantium et ullam amet, laboriosam blanditiis, qui
              natus voluptas voluptatibus facilis facere nobis obcaecati
              repellat exercitationem sunt rem? Fugit, molestiae aliquid.
            </p>
          </div>

          <div className="mb-3">
            {/* Vaccination, etc. */}
            <p className="text-lg font-bold">
              Tindak pencegahan kanker serviks
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint
              cum, ipsum doloremque laudantium, non magnam eaque iste placeat
              nisi, eum culpa necessitatibus vero quod nesciunt molestiae odio
              voluptas fuga animi aliquid ducimus quidem autem reprehenderit
              cumque. A aliquid exercitationem modi nulla ut eum laboriosam,
              alias odit obcaecati reiciendis numquam similique. Distinctio est
              similique necessitatibus repudiandae nesciunt voluptate fugit!
              Nihil expedita laudantium impedit corporis natus, consequuntur
              inventore. Beatae itaque voluptas odio dignissimos exercitationem
              quidem quia maiores minus, suscipit eum, sint laudantium tempore
              eos doloremque sed facilis soluta nobis! Blanditiis, illo vero?
              Doloribus ullam ut sed temporibus, hic magni illo obcaecati
              soluta!
            </p>
          </div>
          <div className="modal-action">
            <button onClick={handleCloseResultModal} className="btn">
              Kembali
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalDiagnoseResult;
