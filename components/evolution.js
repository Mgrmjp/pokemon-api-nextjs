import React, { useState, useEffect } from "react";
import styles from "../css/styles.module.css";

export default function Evolution(props) {
  const [evolve, setEvolve] = useState([]);

  const [evolutionImage, setEvolutionImage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (props.pokemonId === 0) {
          return;
        }

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${props.pokemonId}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        await apiCall(data.evolution_chain.url);
      } catch (error) {
        console.error("Fetch Error:", error.message);
      }
    };

    fetchData();
  }, [props.pokemonId]);


  const apiCall = async (evoUrl) => {
    try {
      const response = await fetch(evoUrl);

      if (response.status !== 200) {
        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
        return;
      }

      const data = await response.json();
      const firstEvolve = data.chain.evolves_to[0]?.species?.name;

      const getAllSpeciesNames = (data) => {
        const speciesNames = [];

        const traverseEvolutionTree = (evolution) => {
          if (evolution && evolution.species && evolution.species.name) {
            speciesNames.push(evolution.species.name);
          }

          if (evolution.evolves_to && evolution.evolves_to.length > 0) {
            evolution.evolves_to.forEach(traverseEvolutionTree);
          }
        };

        data.forEach(traverseEvolutionTree);

        return speciesNames;
      };

      const allSpeciesNames = getAllSpeciesNames(data.chain.evolves_to);

      let evolutionArr = [];
      let sprites = [];

      for (const pokeName of allSpeciesNames) {
        console.log(pokeName);

        evolutionArr = [...evolutionArr, pokeName];

        try {
          const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);

          if (pokemonResponse.status !== 200) {
            console.log(`Looks like there was a problem. Status Code: ${pokemonResponse.status}`);
            return;
          }

          const pokemonData = await pokemonResponse.json();
          sprites = [...sprites, pokemonData.sprites.front_default];

        } catch (err) {
          console.log("Pokemon Fetch Error :-S", err);
        }
      }

      console.log(evolutionArr);

      setEvolve(evolutionArr);
      setEvolutionImage(sprites);

    } catch (err) {
      console.log("Fetch Error :-S", err);
    }
  };

  const evolutions = evolve.map((item, index) => (
    <div className={styles.evolutionRow} key={index + Math.random()}>
      <p className={styles.evolutionName} key={index + Math.random()}>
        {item}
      </p>
      <img key={index + Math.random()} src={evolutionImage[index]} />
    </div>
  ));

  return <div className="evolutions">{evolutions}</div>;
}
