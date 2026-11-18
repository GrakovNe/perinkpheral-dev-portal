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
    <Download href={url} label={`${t('Download', 'Скачать')}: ${name}`}>
      {t('Download', 'Скачать')}
    </Download>
  )
  const parts = [
    [t('Frame and logo', 'Рамка и логотип'), '1', 'PLA/PETG/ABS', caseFiles.frame],
    [t('Back panel', 'Задняя панель'), '1', 'PLA/PETG/ABS', caseFiles.back],
    [t('Base cover', 'Крышка основания'), '1', 'PLA/PETG/ABS', caseFiles.base],
    [t('Bottom', 'Дно'), '1', 'PLA/PETG/ABS', caseFiles.bottom],
    [t('Corner bracket', 'Уголок'), '1', 'PLA/PETG/ABS', caseFiles.bracket],
    [t('Button caps', 'Колпачки кнопок'), '4', 'PLA/PETG/ABS', caseFiles.caps],
    [t('Feet', 'Ножки'), '6', 'TPU', caseFiles.feet],
  ]

  return (
    <>
      <PageHead eyebrow="Rev 1" title={t('Print the case', 'Печать корпуса')} />
      <div className="wrap page-body single">
        <div className="doc">
          <section>
            <p>
              {t(
                'Download the files and drag them into your slicer. Keep their orientation, choose your usual printer and PLA profile, and turn supports off.',
                'Скачайте файлы и перетащите их в слайсер. Сохраните положение деталей, выберите обычный профиль своего принтера и PLA, отключите поддержки.',
              )}
            </p>
            <p>
              {t(
                'We recommend printing the lettering in a different color.',
                'Рекомендуем печатать надпись другим цветом.',
              )}
            </p>
            <div className="buttons">
              <Download href={caseFiles.archive} quiet={false}>
                {t('Download all', 'Скачать всё')}
              </Download>
              <Link className="button quiet" to={local('/hardware#assembly')}>
                {t('Assembly', 'Сборка')} <span className="arrow">-&gt;</span>
              </Link>
            </div>
          </section>

          <section>
            <h2>{t('Print files', 'Файлы для печати')}</h2>
            <Table
              head={[t('Part', 'Деталь'), t('Quantity', 'Количество'), t('Plastic type', 'Тип пластика'), t('File', 'Файл')]}
              rows={parts.map(([name, quantity, plastic_type, url]) => [name, quantity, plastic_type, download(url, name)])}
            />
          </section>

          <section>
            <h2>{t('Source model', 'Исходная модель')}</h2>
            <p>{t('The assembled case in STEP.', 'Корпус в сборе в формате STEP.')}</p>
            <div className="buttons">
              <Download href={caseFiles.step}>
                {t('Download STEP', 'Скачать STEP')}
              </Download>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
