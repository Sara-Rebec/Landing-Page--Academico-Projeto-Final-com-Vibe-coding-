'use strict';
/* Armazenamento: isola o acesso ao LocalStorage.
   Usa prefixo próprio e trata falhas (armazenamento bloqueado, cheio ou dado corrompido),
   para que a página continue funcionando mesmo sem persistência. */
const Armazenamento = {
  prefixo: 'nexustech2026:',
  /* Lê e converte um valor salvo; devolve "padrao" se não existir ou se houver erro. */
  ler(chave, padrao) {
    try {
      const v = localStorage.getItem(this.prefixo + chave);
      return v === null ? padrao : JSON.parse(v);
    } catch (_) { return padrao; }
  },
  /* Grava um valor; devolve true se conseguiu e false se o armazenamento estiver indisponível. */
  gravar(chave, valor) {
    try { localStorage.setItem(this.prefixo + chave, JSON.stringify(valor)); return true; }
    catch (_) { return false; }
  }
};
if (typeof module !== 'undefined') module.exports = { Armazenamento };
