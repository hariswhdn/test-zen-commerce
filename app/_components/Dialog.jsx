export default function Dialog({name, email, onClick}) {
  return (
    <section className="z-20 absolute top-0 left-0 w-full h-full bg-black/20 flex items-center justify-center">
      <section className="flex flex-col w-[calc(100%_-_(16px_*_2))] max-w-[540px] bg-white border rounded divide-y">
        <section className="items-start flex justify-between py-4 px-6">
          <p className="font-bold text-xl">Terimakasih, Pembelian Segera Diproses!</p>
          <button type="button" className="flex" onClick={() => onClick()}>
            <span className="material-icons text-red-500 leading-[28px]">close</span>
          </button>
        </section>
        <section className="flex px-6 py-4">
          <p className="text-lg">{`Pembayaran telah diterima, ${name}! Sistem kami telah mengirimkan detail bukti pembayaran melalui email kamu ${email}.`}</p>
        </section>
      </section>
    </section>
  );
}
