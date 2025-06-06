import Dash1 from './components/Dash1';
import Dash2 from './components/Dash2';
import Dash3 from './components/Dash3';
import './style.css';
import { Taxi } from './taxi';

document.addEventListener('DOMContentLoaded', async () => {
  const taxi = new Taxi();
  await taxi.init();
  await taxi.loadTaxi();
  //await Promise.all([Dash1()]);
  await Promise.all([Dash1(taxi), Dash2(taxi), Dash3(taxi)]);
  //Dash2(), Dash3()]);
  document.querySelector('#loading')?.setAttribute('data-active', 'false');
  console.log('carregou');
});
