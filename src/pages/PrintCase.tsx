// SPDX-License-Identifier: MIT
import { Link } from 'react-router-dom'
import { PageHead, Table } from '../components/Doc'
import { Download } from '../components/Download'
import { caseFiles } from '../content/links'
import { useLocal, useT } from '../i18n'

export function PrintCase() {
  const t = useT()
  const local = useLocal()
  const download = (url: string, name: string) => (
    <Download href={url} label={`${t('Download', 'Скачать')}: ${name}, 3MF`}>
      {t('Download', 'Скачать')} 3MF
    </Download>
  )
  const parts = [
    [t('Frame and logo', 'Рамка и логотип'), t('One frame with the lettering. Front side down.', 'Одна рамка с надписью. Лицом вниз.'), caseFiles.frame],
    [t('Back panel', 'Задняя панель'), t('One panel behind the display. Outer side down.', 'Одна крышка за экраном. Внешней стороной вниз.'), caseFiles.back],
    [t('Base cover', 'Крышка основания'), t('One cover with the button openings. Top side down.', 'Одна крышка с отверстиями кнопок. Верхом вниз.'), caseFiles.base],
    [t('Bottom', 'Дно'), t('One bottom with the board and battery supports. Bottom side down.', 'Одно дно с опорами платы и бортиками аккумулятора. Низом вниз.'), caseFiles.bottom],
    [t('Corner bracket', 'Уголок'), t('One bracket for the display. Wide side down.', 'Один уголок крепления экрана. Широкой стороной вниз.'), caseFiles.bracket],
    [t('Button caps', 'Колпачки кнопок'), t('Four caps. Wide side down.', 'Четыре колпачка. Широкой стороной вниз.'), caseFiles.caps],
    [t('Feet, optional', 'Ножки, необязательно'), t('Six TPU feet. Flat side down.', 'Шесть ножек из TPU. Плоской стороной вниз.'), caseFiles.feet],
  ]

  return (
    <>
      <PageHead eyebrow="Rev 1" title={t('Print the case', 'Печать корпуса')}>
        {t('3MF files, ready for the slicer. No supports.', 'Файлы 3MF для слайсера. Печать без поддержек.')}
      </PageHead>
      <div className="wrap page-body single">
        <div className="doc">
          <section>
            <p>
              {t(
                'Download the files and drag them into your slicer. Keep their orientation, choose your usual printer and PLA profile, and turn supports off. The files do not change your print settings.',
                'Скачайте файлы и перетащите их в слайсер. Сохраните положение деталей, выберите обычный профиль своего принтера и PLA, отключите поддержки. Файлы не меняют настройки печати.',
              )}
            </p>
            <p>
              {t(
                'Keep the frame and logo as one object with two parts. Print both in one color, or assign the lettering a second color. The feet use TPU and can be skipped.',
                'Оставьте рамку и логотип одним объектом из двух частей. Печатайте одним цветом или назначьте надписи второй. Ножки печатаются из TPU, их можно пропустить.',
              )}
            </p>
            <div className="buttons">
              <Download href={caseFiles.archive} quiet={false}>
                {t('Download all, ZIP', 'Скачать всё, ZIP')}
              </Download>
            </div>
          </section>

          <section>
            <h2>{t('Print files', 'Файлы для печати')}</h2>
            <Table
              head={[t('Part', 'Деталь'), t('Description', 'Описание'), t('File', 'Файл')]}
              rows={parts.map(([name, description, url]) => [name, description, download(url, name)])}
            />
          </section>

          <section>
            <h2>{t('Source model', 'Исходная модель')}</h2>
            <p>{t('The assembled case in STEP, for editing.', 'Корпус в сборе в формате STEP, для редактирования.')}</p>
            <div className="buttons">
              <Download href={caseFiles.step}>
                {t('Download STEP', 'Скачать STEP')}
              </Download>
              <Link className="button quiet" to={local('/hardware#assembly')}>
                {t('Assembly', 'Сборка')} <span className="arrow">-&gt;</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
