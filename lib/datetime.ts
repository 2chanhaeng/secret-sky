export function formatDate(date : Date) {
  const now = Date.now();
  const diff = now - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 0) {
    return '지금';
  } else if (seconds < 60) {
    return `${seconds}초 전`;
  } else if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else if (days < 30) {
    return `${days}일 전`;
  } else {
    const dateFormatter = new Intl.DateTimeFormat('ko', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const nowFormatter = new Intl.DateTimeFormat('ko', {
      year: 'numeric',
      month: '2-digit'
    });

    const formattedDate = dateFormatter.format(date);
    const formattedNow = nowFormatter.format(now);

    if (formattedDate.slice(0, 4) !== formattedNow.slice(0, 4)) {
      return formattedDate;
    } else if (formattedDate.slice(5, 7) !== formattedNow.slice(5, 7)) {
      return formattedDate.slice(5);
    } else {
      return `${days}일 전`;
    }
  }
}