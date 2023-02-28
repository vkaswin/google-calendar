<script setup lang="ts">
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { RouteNames } from "@/router";
import Input from "@/components/Input.vue";

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
        <Input
          label="Email Id"
          type="number"
          v-model="formState.email"
          :error="$v.email.$error"
          :error-message="$v.email.$errors[0]?.$message"
        />
      </div>
    </div>
    <div>
      <div :class="styles.field">
        <Input
          label="Password"
          type="password"
          v-model="formState.password"
          :error="$v.password.$error"
          :error-message="$v.password.$errors[0]?.$message"
        />
      </div>
    </div>
    <div :class="styles.cta">
      <button @click="handleSubmit">Login</button>
      <span>
        Dont't have an account ? &nbsp;
        <router-link :to="{ name: `${RouteNames.register}` }">
          <span>Sign Up Here</span>
        </router-link>
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
