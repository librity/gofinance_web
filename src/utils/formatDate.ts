const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('pt-br');

export default formatDate;
