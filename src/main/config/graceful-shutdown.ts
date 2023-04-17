import { Server } from 'http'

enum ExitStatus {
  FAILURE = 1,
  SUCCESS = 0,
}

export default (server: Server): void => {
  const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT']

  for (const exitSignal of exitSignals) {
    process.on(exitSignal, async () => {
      try {
        server.close()
        console.warn('App exited with success')
        process.exit(ExitStatus.SUCCESS)
      } catch (error) {
        console.error(`App exited with error: ${error}`)
        process.exit(ExitStatus.FAILURE)
      }
    })
  }
}
