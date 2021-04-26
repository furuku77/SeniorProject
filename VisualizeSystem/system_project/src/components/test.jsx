import React, { useEffect, useState, useRef } from "react";
import Data from '../file/test2.json'


const Auto = () => {
    const [display, setDisplay] = useState(false);
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef(null);



    useEffect(() => {
        const pokemon = [];
        const promises = new Array(20)
            .fill()
            .map((v, i) => fetch(`https://pokeapi.co/api/v2/pokemon-form/${i + 1}`));
        Promise.all(promises).then(pokemonArr => {
            return pokemonArr.map(value =>
                value
                    .json()
                    .then(({ name, sprites: { front_default: sprite } }) =>
                        pokemon.push({ name, sprite })
                    )
            );
        });
        setOptions(pokemon);
    }, []);



    //   const tmp = [{name : 'Asia', sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"},{name : 'asdfgh', sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"},{name : 'Asia', sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"}]
    //   setOptions(tmp)
    useEffect(() => {
        const lis = ['BKK',"HKT","LAX","NRT"]
        const station = lis.map(

            tmp => (
                // 'link': tmp.link, 'val': tmp.val
                console.log(Data[tmp]['Name']),
                {
                    name: tmp + Data[tmp]['Name'],
                    sprite: Data[tmp]['Name']
                }
                
            )
        )

        setOptions(station)
    }, []);



    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    });

    const handleClickOutside = event => {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(event.target)) {
            setDisplay(false);
        }
    };

    const updatePokeDex = poke => {
        setSearch(poke);
        setDisplay(false);
    };



    return (
        <div ref={wrapperRef} className="flex-container flex-column pos-rel">
            <input
                id="auto"
                onClick={() => setDisplay(!display)}
                placeholder="Type to search"
                value={search}
                onChange={event => setSearch(event.target.value)}
            />
            {display && (
                <div className="autoContainer">
                    {options
                        .filter(({ name }) => name.indexOf(search.toLowerCase()) > -1)
                        .map((value, i) => {
                            return (
                                <div
                                    onClick={() => updatePokeDex(value.name)}
                                    className="option"
                                    key={i}
                                    tabIndex="0"
                                >
                                    <span>{value.name}</span>
                                    {/* <span>, {value.sprite}</span> */}
                                    
                                    {/* <img src={value.sprite} alt="pokemon" /> */}
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

function App() {
    return (
        <div className="App">
            <h1>Custom AutoComplete React</h1>
            <div className="logo"></div>
            <div className="auto-container">
                <Auto />
            </div>
        </div>
    );
}

export default App;