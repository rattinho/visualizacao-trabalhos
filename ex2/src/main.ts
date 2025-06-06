import Dash3 from './components/Dash3';
import './style.css';
import { Taxi } from './taxi';

document.addEventListener('DOMContentLoaded', async () => {
  const taxi = new Taxi();
  await taxi.init();
  await taxi.loadTaxi();
  await Promise.all([Dash3(taxi)]);
  document.querySelector('#loading')?.setAttribute('data-active', 'false');
  console.log('carregou');
});
