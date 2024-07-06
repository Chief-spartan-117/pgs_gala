<script>
  import background from "../assets/gala_background.png";
  import mask from "../assets/gala_mask.png";
  import galaText from "../assets/img/Gala.png";
  import tippy from "../actions/tippy";

  const devs = [
    {
      id: 1,
      name: "Sagar",
      img: "/src/assets/img/dev/sagar.jpg",
    },
    {
      id: 2,
      name: "Sagar Shrestha",
      img: "/src/assets/img/dev/sagar.jpg",
    },
    {
      id: 3,
      name: "Sagar",
      img: "/src/assets/img/dev/sagar.jpg",
    },
    {
      id: 4,
      name: "Sagar",
      img: "/src/assets/img/dev/sagar.jpg",
    },
    {
      id: 5,
      name: "Sagar",
      img: "/src/assets/img/dev/sagar.jpg",
    },
  ];
</script>

<svelte:head>
  <title>
    PGS Gala | Unforgettable Evening at the Gala - Elegance, Entertainment &
    Auctions
  </title>
</svelte:head>

<div class="w-screen h-screen" style="background-color: #05103A; overflow: hidden;">
  <div class="w-full h-full flex justify-center items-center  text-white" style="background: url({background}); background-size: cover; background-position: center; display: flex; flex-direction: column;">
    <!-- svelte-ignore a11y-missing-attribute -->
    <img
      class="-ml-2 mt-8 lg:w-96 xl:w-[27rem] max-lg:w-96 max-sm:w-72"
      src={mask}
    />
    <div
      class="xl:text:3xl -mb-5 -mt-4 inline-block bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-center text-3xl font-extrabold text-transparent lg:text-2xl max-lg:text-2xl max-sm:-mt-1 max-sm:text-xl"
    >
      Presidential
    </div>
    <div class="mt-3">
      <img
        src={galaText}
        alt="Gala Text"
        class="w-[24rem] lg:w-80 xl:w-96 max-lg:w-80 max-sm:w-60"
      />
    </div>
  </div>

  <div
    class="fixed bottom-0 flex w-full -translate-y-8 flex-row items-end justify-between px-16 max-md:-translate-y-4 max-md:px-4 max-sm:flex-col max-sm:items-center max-sm:gap-2"
  >
    <div class="max-md:flex max-md:flex-row max-md:gap-2">
      <p class="font-[cadiz] text-6xl font-black text-white max-md:text-4xl">
        03
      </p>
      <p class="font-[cadiz] text-4xl font-black text-white max-md:text-4xl">
        AUG
      </p>
    </div>
    <div class="flex flex-row items-center gap-4">
      <p class="text-white max-md:text-sm max-sm:text-[0.6rem]">
        Designed & Developed By:
      </p>
      <div class="flex flex-row items-center">
        {#each devs as dev, index (dev.id)}
          <div
            class="relative -mr-4 rounded-full max-md:-mr-3"
            use:tippy={{ content: dev.name, placement: "top" }}
          >
            <img
              src={dev.img}
              alt={dev.name}
              class="relative w-9 rounded-full border-[0.2rem] border-[rgb(5_16_58)] max-sm:w-7"
              style="z-index: {devs.length - index};"
            />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
