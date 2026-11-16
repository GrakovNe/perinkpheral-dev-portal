import { PageHead, Table } from '../components/Doc'
import { author, repo } from '../content/links'

export function Contacts() {
  return (
    <>
      <PageHead eyebrow="Contacts" title="Contacts">
        Questions, bug reports and ideas go to the issues of the repository they concern. For anything else, write to
        the author directly.
      </PageHead>
      <div className="wrap page-body single">
        <div className="doc">
          <div className="contacts">
            <a className="panel" href={repo.firmware}>
              <p className="kind">GitHub</p>
              <p className="value">GrakovNe/perinkpheral</p>
            </a>
            <a className="panel" href={`mailto:${author.email}`}>
              <p className="kind">Email</p>
              <p className="value">{author.email}</p>
            </a>
            <a className="panel" href={`https://t.me/${author.telegram}`}>
              <p className="kind">Telegram</p>
              <p className="value">@{author.telegram}</p>
            </a>
          </div>

          <section>
            <h2>Repositories</h2>
            <Table
              head={['Repository', 'What is in it']}
              rows={[
                [<a href={repo.firmware}>perinkpheral</a>, 'Firmware, SDK, tools, hardware, the application guide'],
                [<a href={repo.apps}>perinkpheral-apps</a>, 'The official applications and their catalog'],
                [<a href={repo.clion}>perinkpheral-clion-plugin</a>, 'The CLion plugin'],
                [<a href={repo.homeAssistant}>perinkpheral-hacs</a>, 'The Home Assistant integration'],
                [<a href={repo.portal}>perinkpheral-dev-portal</a>, 'This portal'],
              ]}
            />
          </section>
        </div>
      </div>
    </>
  )
}
