import './App.scss';

function App() {
  const str: string = 'ahoj jak se\n mas?\n Ja se mam dobre a co ty? \nNa pohodu?';
  
  return (
    <div className="App">
      {str.split('\n').map(s => {
        return <p>{s}</p>
      })

      }
    </div>
  );
}

export default App;
