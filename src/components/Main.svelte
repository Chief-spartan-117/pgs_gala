<script>
  import background from "../assets/gala_background.png";
  import mask from "../assets/gala_mask.png";
</script>

<svelte:head>
  <title>
    PGS Gala | Unforgettable Evening at the Gala - Elegance, Entertainment &
    Auctions
  </title>
</svelte:head>

<div class="h-screen w-screen" style="background-color: #05103A;">
  <div
    class="flex h-full w-full items-center justify-center text-white"
    style="background: url({background}); background-size: cover; background-position: center; display: flex; flex-direction: column;"
  >
    <img class="-ml-2 -mt-2 sm:h-[500px] max-sm:w-full" src={mask} />
    <div class="-mb-5 mt-7 text-center text-2xl">Presidential</div>
    <div class="archivo-black-regular" style="font-size: 100px;">GALA</div>
  </div>
</div>
<div class="relative z-10">
  <h1 class="text-5xl text-white">This is main page</h1>
</div>
