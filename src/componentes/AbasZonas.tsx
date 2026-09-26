import { Icone } from './Icone';
export function AbasZonas() {
  return <nav className="abas-zonas" aria-label="Zonas da Ilha Elétrica">{['Comandos','Força','Predial','Proteção','Mecânica'].map((nome,i)=><button key={nome} className={i===0 ? 'ativa' : ''} disabled={i>0} title={i>0 ? 'Desbloqueia em breve' : 'Zona atual'} aria-current={i===0 ? 'page' : undefined}><Icone nome={i===0 ? 'raio' : 'cadeado'} tamanho={16}/>{nome}</button>)}</nav>;
}
