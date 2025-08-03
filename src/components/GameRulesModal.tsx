export const GameRulesModal = () => {
  return (
    <div className='flex flex-col items-center justify-center px-0'>
      <h1 className='mb-4 mt-0 self-center text-center text-3xl font-black'>{'Правила игры'}</h1>
      <div className='self-start'>
        <h2 className='mb-5'>
          <b>Составь слова, используя буквы из предложенного слова</b>
        </h2>
        <h3 className='mb-2 text-sm'>• Слова должны состоять из 4-х и более букв</h3>
        <h3 className='mb-2 text-sm'>• Принимаются только имена нарицательные в единственном числе</h3>
        <h3 className='mb-5 text-sm'>• У тебя есть ровно 7 минут!</h3>
        <h3 className='mb-2 text-sm'>
          <b>Зарабатывай очки, чтобы продвинуться в рейтинге </b>
        </h3>
        <h3 className='mb-2 text-sm'>• Слова из 4-х букв стоят 1 очко</h3>
        <h3 className='mb-5 text-sm'>• Более длинные слова оцениваются по 1-му очку за каждую букву</h3>

        <h3 className='mb-2 text-sm'>Считаешь, что мы пропустили слово? Напиши нам куда-то хаха лооол</h3>
      </div>
    </div>
  );
};
