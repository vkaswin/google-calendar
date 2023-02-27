<script setup lang="ts">
import Input from "@/components/Input.vue";
import { RouteNames } from "@/router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { reactive } from "vue";

let formState = reactive({ email: "", password: "" });

let rules = {
  email: {
    required: helpers.withMessage("Please enter email", required),
    email: helpers.withMessage("Invalid email", email),
  },
  password: {
    required: helpers.withMessage("Please enter password", required),
  },
};

const $v = useVuelidate(rules, formState);

let handleSubmit = async () => {
  let isValid = await $v.value.$validate();
  if (!isValid) return;
  console.log(formState);
};
</script>

<template>
  <div :class="styles.header">
    <span>Sign In</span>
  </div>
  <div :class="styles.container">
    <div>
      <div :class="styles.field">
        <label>Email Id</label>
        <!-- /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ -->
        <!-- <Input /> -->
        <input v-model="formState.email" />
      </div>
      <span v-if="$v.email.$error" :class="styles.error_msg">{{
        $v.email.$errors[0].$message
      }}</span>
    </div>
    <div>
      <div :class="styles.field">
        <label>Password</label>
        <!-- <Input /> -->
        <input v-model="formState.password" />
      </div>
      <span v-if="$v.password.$error" :class="styles.error_msg">{{
        $v.password.$errors[0].$message
      }}</span>
    </div>
    <div :class="styles.cta">
      <button @click="handleSubmit">Login</button>
      <span>
        Dont't have an account ? &nbsp;
        <router-link :to="{ name: `${RouteNames.register}` }"></router-link>
        <span>Sign Up Here</span>
      </span>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  span {
    font-size: 24px;
    font-family: "Poppins-Medium", sans-serif;
  }
}
.container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 50px;
  .field {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .error_msg {
    display: block;
    margin-top: 5px;
    color: #da3025;
    font-size: 14px;
  }
}
.cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  button {
    background-color: gray;
    border: none;
    color: white;
    padding: 7px 0px;
    width: 100%;
    border-radius: 4px;
  }
  span {
    color: var(--text-color);
    cursor: default;
    span {
      color: var(--primary-color);
      font-family: "Poppins-Medium", sans-serif;
      cursor: pointer;
    }
  }
}
</style>
