import React, { useState, useEffect } from 'react';

export default function Evolution(props) {

console.log(props.pokemonId)

const [evolve, setEvolve] = useState([])

useEffect(() => {
    if (props.pokemonId !== 0) {
        fetch('https://pokeapi.co/api/v2/pokemon-species/' + props.pokemonId)
        .then(
            function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                response.status);
                return;
            }
            response.json().then(function(data) {
                console.log(data)
                apiCall(data.evolution_chain.url)
            });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    }
}, [props.pokemonId]);


const apiCall = (evoUrl) => {
    fetch(evoUrl)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json().then(function(data) {
            console.log(data.chain.evolves_to[0].species.name)
            console.log(data.chain.evolves_to[0].evolves_to[0].species.name)
            setEvolve(data.chain.evolves_to[0].species.name)
            setEvolve(evolve => [...evolve, data.chain.evolves_to[0].evolves_to[0].species.name])
            console.log(evolve)
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

// const evolutions = evolve.map((item, index) =>
//     <p key={index}>{item}</p>
// );

  return (
    
    <div>
        {/* {evolutions} */}
    </div>

  )
}
