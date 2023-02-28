<script setup lang="ts">
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  helpers,
  sameAs,
  alpha,
  minLength,
} from "@vuelidate/validators";
import { RouteNames } from "@/router";
import Input from "@/components/Input.vue";

let formState = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

let rules = {
  name: {
    required: helpers.withMessage("Please enter name", required),
    alpha: helpers.withMessage("Name should contains alphabets only", alpha),
    minLength: helpers.withMessage(
      "Name should contains atleast 3 characters",
      minLength(3)
    ),
  },
  email: {
    required: helpers.withMessage("Please enter email", required),
    email: helpers.withMessage("Invalid email", email),
  },
  password: {
    required: helpers.withMessage("Please enter password", required),
  },
  confirmPassword: {
    required: helpers.withMessage("Please enter confirm password", required),
    sameAs: helpers.withMessage(
      "Confirm password is not match wiht the password",
      sameAs(formState.password)
    ),
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
    <span>Sign Up</span>
  </div>
  <div :class="styles.container">
    <div>
      <div :class="styles.field">
        <Input
          label="Name"
          v-model="formState.name"
          :error="$v.name.$error"
          :error-message="$v.name.$errors[0]?.$message"
        />
      </div>
    </div>
    <div>
      <div :class="styles.field">
        <Input
          label="Email Id"
          v-model="formState.email"
          :error="$v.email.$error"
          :error-message="$v.email.$errors?.[0]?.$message"
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
    <div>
      <div :class="styles.field">
        <Input
          label="Confirm Password"
          type="password"
          v-model="formState.confirmPassword"
          :error="$v.confirmPassword.$error"
          :error-message="$v.confirmPassword.$errors[0]?.$message"
        />
      </div>
    </div>
    <div :class="styles.cta">
      <button @click="handleSubmit">Register</button>
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
  margin-top: 30px;
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
}
</style>
