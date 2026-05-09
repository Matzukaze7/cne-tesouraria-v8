window.CNE = window.CNE || {};

CNE.trimestreEscutista = function trimestreEscutista(dateStr) {
  if (!dateStr) return 'Sem data';

  const date = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(date.getTime())) return 'Sem data';

  const month = date.getMonth() + 1;

  if (month >= 10 && month <= 12) return '1º Trimestre';
  if (month >= 1 && month <= 3) return '2º Trimestre';
  if (month >= 4 && month <= 6) return '3º Trimestre';

  return '4º Trimestre';
};

CNE.anoEscutista = function anoEscutista(dateStr = null) {
  const date = dateStr ? new Date(dateStr) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return month >= 10
    ? `${year}/${year + 1}`
    : `${year - 1}/${year}`;
};

CNE.trimestreRange = function trimestreRange(trimestre, anoInicial) {
  const year = Number(anoInicial);

  switch (trimestre) {
    case '1º Trimestre':
      return { inicio: `${year}-10-01`, fim: `${year}-12-31` };

    case '2º Trimestre':
      return { inicio: `${year}-10-01`, fim: `${year + 1}-03-31` };

    case '3º Trimestre':
      return { inicio: `${year}-10-01`, fim: `${year + 1}-06-30` };

    case '4º Trimestre':
      return { inicio: `${year}-10-01`, fim: `${year + 1}-09-30` };

    default:
      return null;
  }
};