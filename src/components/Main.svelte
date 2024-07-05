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

<div class="relative z-10 w-full">
  <div
    class="fixed left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-[55%] flex-col items-center justify-center text-white max-sm:-translate-y-[60%]"
  >
    <!-- svelte-ignore a11y-missing-attribute -->
    <img class="-ml-2 mt-8 sm:h-[30rem] max-sm:mt-24 max-sm:w-72" src={mask} />
    <div
      class="-mb-5 -mt-4 inline-block bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-center text-3xl font-extrabold text-transparent max-sm:-mt-1 max-sm:text-xl"
    >
      Presidential
    </div>
    <div class="mt-3">
      <img src={galaText} alt="Gala Text" class="w-[24rem] max-sm:w-60" />
    </div>
  </div>

  <div
    class="fixed bottom-0 flex w-full -translate-y-8 flex-row items-end justify-between px-16 max-sm:-translate-y-4 max-sm:flex-col max-sm:items-center max-sm:gap-2 max-sm:px-4"
  >
    <div class="max-sm:flex max-sm:flex-row max-sm:gap-2">
      <p class="font-[cadiz] text-6xl font-black text-white max-sm:text-4xl">
        03
      </p>
      <p class="font-[cadiz] text-4xl font-black text-white max-sm:text-4xl">
        AUG
      </p>
    </div>
    <div class="flex flex-row items-center gap-4">
      <p class="text-white max-sm:text-[0.6rem]">Designed & Developed By:</p>
      <div class="flex flex-row items-center">
        {#each devs as dev, index (dev.id)}
          <div
            class="relative -mr-4 rounded-full border-[0.2rem] border-[rgb(5_16_58)] max-sm:-mr-3"
            use:tippy={{ content: dev.name, placement: "top" }}
          >
            <img
              src={dev.img}
              alt={dev.name}
              class="relative w-9 rounded-full max-sm:w-7 z-[{devs.length -
                index}]"
            />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
