window.CNE = window.CNE || {};

CNE.realtime = {
  channels: [],
  lastSync: null,
  enabled: false
};

CNE.subscribeRealtime = function subscribeRealtime(tables = [], onChange = () => {}) {
  if (!CNE.db) {
    console.warn('Supabase não disponível para realtime');
    return;
  }

  const debounced = CNE.debounce(async payload => {
    CNE.realtime.lastSync = new Date().toISOString();
    await onChange(payload);
  }, 250);

  tables.forEach(table => {
    const channel = CNE.db
      .channel('realtime_' + table)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table
      }, payload => {
        console.log('[Realtime]', table, payload.eventType);
        debounced(payload);
      })
      .subscribe(status => {
        console.log('[Realtime status]', table, status);
      });

    CNE.realtime.channels.push(channel);
  });

  CNE.realtime.enabled = true;
};

CNE.unsubscribeRealtime = async function unsubscribeRealtime() {
  for (const channel of CNE.realtime.channels) {
    try {
      await CNE.db.removeChannel(channel);
    } catch (e) {
      console.error(e);
    }
  }

  CNE.realtime.channels = [];
  CNE.realtime.enabled = false;
};

CNE.partialRefresh = async function partialRefresh(table) {
  if (!CNE.db || !CNE.state) return;

  const response = await CNE.db.from(table).select('*');
  CNE.state[table] = response.data || [];

  return CNE.state[table];
};