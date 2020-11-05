import React, { useState, useEffect } from "react";
import styles from "../css/styles.module.css";

export default function Evolution(props) {
  const [evolve, setEvolve] = useState([]);

  const [evolutionImage, setEvolutionImage] = useState([]);

  useEffect(() => {
    if (props.pokemonId !== 0) {
      fetch("https://pokeapi.co/api/v2/pokemon-species/" + props.pokemonId)
        .then(function (response) {
          if (response.status !== 200) {
            console.log(
              "Looks like there was a problem. Status Code: " + response.status
            );
            return;
          }
          response.json().then(function (data) {
            apiCall(data.evolution_chain.url);
          });
        })
        .catch(function (err) {
          console.log("Fetch Error :-S", err);
        });
    }
  }, [props.pokemonId]);

  const apiCall = (evoUrl) => {
    fetch(evoUrl)
      .then(function (response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function (data) {
          console.log(data.chain.evolves_to[0].species.name);
          if (data.chain.evolves_to[0].evolves_to[0]) {
            console.log(data.chain.evolves_to[0].evolves_to[0].species.name);
          }
          const firstEvolve = data.chain.evolves_to[0].species.name;
          if (data.chain.evolves_to[0].evolves_to[0]) {
            const secondEvolve =
              data.chain.evolves_to[0].evolves_to[0].species.name;
            const evolvesInto = [firstEvolve, secondEvolve];
            setEvolve(evolvesInto);
          } else {
            const evolvesInto = [firstEvolve];
            setEvolve(evolvesInto);
            fetch("https://pokeapi.co/api/v2/pokemon/" + evolvesInto[0])
              .then(function (response) {
                if (response.status !== 200) {
                  console.log(
                    "Looks like there was a problem. Status Code: " +
                      response.status
                  );
                  return;
                }

                response.json().then(function (data) {
                  console.log(data.sprites.front_default);
                  setEvolutionImage(data.sprites.front_default);
                });
              })
              .catch(function (err) {
                console.log("Fetch Error :-S", err);
              });
          }
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  };

  const evolutions = evolve.map((item, index) => (
    <div className={styles.evolutionRow} key={index + Math.random()}>
      <p className={styles.evolutionName} key={index + Math.random()}>
        {item}
      </p>
      <img key={index + Math.random()} src={evolutionImage} />
    </div>
  ));

  return <div>{evolutions}</div>;
}
