import { App } from "../controls/App";
import { PagedScreen } from "./PagedScreen";
import { Fonts } from "../Fonts";
import { IScreen } from "../core/IScreen";
import { TextInput } from "../controls/TextInput";
import { Button } from "../controls/Button";
import { DynamicText } from "../controls/DynamicText";

export class LoginScreen extends PagedScreen implements IScreen {

  constructor(app: App) {
    super(app, { twoColumnsInLandscape: true, tag: "form" });
    let usernameInput = new TextInput(this, { initialValue: "", name: "userid" });
    let passwordInput = new TextInput(this, { initialValue: "", name: "password", type: "password" });
    let errorDisplay = new DynamicText(this, { initialValue: "" });

    let ioService = "https://ganaye.com/slego-io-dev";

    this.addDiv(
      { text: "User name:", font: Fonts.defaultFont, },
      { layer: usernameInput });
    this.addDiv(
      { text: "Password:", font: Fonts.defaultFont },
      { layer: passwordInput });
    this.addDiv(
      { layer: errorDisplay });
    this.addDiv(
      {
        layer: new Button(this, "Login with email", {
          onClick: () => {
            //const formData = new FormData(form);
            errorDisplay.setValue("");
            const jsonData = {
              username: usernameInput.value,
              password: passwordInput.value
            };
            console.log(jsonData);
            let status: number;
            let statusText: string;
            fetch(ioService + "/auth/login", {
              redirect: 'manual',
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(jsonData)
            })
              .then(response => {
                status = response.status;
                statusText = response.statusText;
                console.error("Response:", status, statusText);  // Else, get the response text to see the error message
                return response.text();
              })
              .then(data => {
                if (status === 200) {  // Check if status code is 200 OK
                  //window.location.href = "/slego";  // Redirect to /slego 
                  errorDisplay.setValue("You are logged in");
                } else {
                  console.error("Error data:", data);  // Else, get the response text to see the error message
                  errorDisplay.setValue(data || statusText);
                }

              })
              .catch(error => {
                console.error("Error:", error);
              });

          }
        })
      });
    this.addDiv(
      {
        layer: new Button(this, "Login with google", {
          onClick: () => {
            location.href = ioService + "/auth/google";
          }
        })
      });
    this.addDiv(
      {
        layer: new Button(this, "Login with facebook", {
          onClick: () => {
            location.href = ioService + "/auth/facebook";
          }
        })
      });

  }

  getTitle(): string {
    return "Settings";
  }
}

/*
<form id="loginForm">
<div>
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" required>
</div>
<div>
  <label for="password">Password:</label>
  <input type="password" id="password" name="password" required>
</div>
<div>
  <button type="submit">Login</button>
</div>
</form>

<script>
document.addEventListener("DOMContentLoaded", function() {
});
</script>
*/