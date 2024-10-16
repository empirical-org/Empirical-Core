import Pusher from 'pusher-js';

const pusherInitializer = (id: number, channelEvent: string, callback?: () => void) => {
  if (process.env.RAILS_ENV === 'development') { Pusher.logToConsole = true; }

  const pusher = new Pusher(process.env.PUSHER_KEY, { cluster: process.env.PUSHER_CLUSTER });
  const channelName = String(id)
  const channel = pusher.subscribe(channelName);

  channel.bind(channelEvent, () => {
    if (callback && typeof(callback) === 'function') { callback() }

    pusher.unsubscribe(channelName)
  })

  return null
}

export default pusherInitializer
