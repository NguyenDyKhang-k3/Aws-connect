export const createPhoneForm = () =>{
// JavaScript code to create phone-form with Vietnam flag
const vietnamPhoneForm = `
  <div id="phone-form">
    <div>
      <div id="country-code">
        <p>Country</p>
        <button id="dropdown-btn" style="border-color: rgba(102, 102, 102, 0.8); border-width: 0px;">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 341" width="20px" height="13px">
              <rect width="512" height="341" fill="#da251d"/>
              <polygon fill="#ff0" points="256,60.9 278.1,158.1 371.7,158.1 295.8,205.3 318.9,302.5 256,255.3 193.1,302.5 216.2,205.3 140.3,158.1 233.9,158.1"/>
            </svg>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10.2 6.2" role="img" width="10px" height="15px" aria-hidden="true">
                <path d="M4.7 6.1.18 1.6a.5.5 0 0 1 0-.8l.5-.5a.52.52 0 0 1 .4-.2c.2 0 .3 0 .4.2l3.6 3.6L8.68.2a.5.5 0 0 1 .8 0l.5.5a.5.5 0 0 1 0 .8L5.48 6a.52.52 0 0 1-.4.2c-.18 0-.28 0-.38-.1z"></path>
              </svg>
            </div>
          </div>
        </button>
        <div id="dropdown-options" style="display: none;">
          <ul>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 341" width="20px" height="13px">
                <rect width="512" height="341" fill="#da251d"/>
                <polygon fill="#ff0" points="256,60.9 278.1,158.1 371.7,158.1 295.8,205.3 318.9,302.5 256,255.3 193.1,302.5 216.2,205.3 140.3,158.1 233.9,158.1"/>
              </svg>
              <div class="country">Vietnam</div>
              <div class="country-code">+84</div>
            </li>
            <li>
                      <svg
                        viewBox="0 0.5 21 14"
                        xmlns="http://www.w3.org/2000/svg"
                        class="flag-icon flag-icon-hk CountryFlagInList-sc-bi1svf-4 iAflTq"
                        width="20px"
                        height="13px"
                      >
                        <g fill="none" fill-rule="evenodd">
                          <path fill="#FFF" d="M0 0h21v15H0z"></path>
                          <path fill="#ee1c25" d="M0 0h21v15H0z"></path>
                          <path
                            d="M12 7.19c-.798-.5-1 .409-1 0 0-.828.895-1.5 2-1.5s2 .672 2 1.5c-.949 0-1.044.5-1.5.5-.56 0-.702 0-1.5-.5zM13.25 7a.25.25 0 1 0 0-.5.25.25 0 0 0 0 .5zm-1.81 1.962c.228-.913-.698-.824-.31-.95.788-.257 1.703.387 2.045 1.438.341 1.05-.021 2.11-.809 2.366-.293-.903-.798-.838-.939-1.272-.173-.533-.217-.668.012-1.582zm.566 1.13a.25.25 0 1 0 .476-.154.25.25 0 0 0-.476.154zM9.58 8.977c.94-.065.57-.919.81-.588.486.67.157 1.74-.737 2.389-.894.65-2.013.632-2.5-.038.768-.558.55-1.018.92-1.286.453-.33.568-.413 1.507-.477zm-.899.888a.25.25 0 1 0 .294.405.25.25 0 0 0-.294-.405zm.312-2.652c.351.874 1.049.258.809.588-.487.67-1.606.687-2.5.038-.894-.65-1.223-1.719-.736-2.39.767.559 1.138.21 1.507.478.453.33.568.413.92 1.286zm-1.124-.58a.25.25 0 1 0-.293.404.25.25 0 0 0 .293-.404zm2.619-.524c-.722.605.08 1.078-.309.951-.788-.256-1.15-1.315-.809-2.365.342-1.05 1.257-1.695 2.045-1.439-.293.903.153 1.147.012 1.581-.173.533-.217.668-.939 1.272zm.205-1.247a.25.25 0 1 0-.475-.155.25.25 0 0 0 .475.155z"
                            fill="#FFF"
                          ></path>
                        </g>
                      </svg>
                      <div class="country">Hong Kong</div>
                      <div class="country-code">+852</div>
                    </li>
          </ul>
        </div>
      </div>
      <div id="phone-input">
        <p>Phone number or quick connect</p>
        <div>
          <input type="text" placeholder="Enter a phone number">
        </div>
      </div>
    </div>
  </div>
`;

// Append the Vietnam phone form to the phone-section
document.getElementById('phone-section').innerHTML += vietnamPhoneForm;

}