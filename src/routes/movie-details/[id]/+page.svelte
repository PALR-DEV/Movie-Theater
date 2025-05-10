<script>
	import { page } from '$app/stores';
    $: movieId = $page.params.id;

</script>

<h1>{movieId}</h1>