<template>
	<div class="vgb-example">
		<input
			:value="attributes.message"
			placeholder="Message…"
			@input="$emit('update:attributes', { message: $event.target.value })"
		/>
		<button
			type="button"
			@click="$emit('update:attributes', { count: attributes.count + 1 })"
		>
			Clicked {{ attributes.count }} times
		</button>
		<p>{{ attributes.message }}</p>
	</div>
</template>

<script>
export default {
	name: 'ExampleEdit',
	props: { attributes: { type: Object, required: true } },
	emits: [ 'update:attributes' ],
};
</script>

<style>
.vgb-example {
	border: 1px dashed #949494;
	padding: 12px;
}
.vgb-example input {
	display: block;
	width: 100%;
	margin-bottom: 8px;
}
</style>
