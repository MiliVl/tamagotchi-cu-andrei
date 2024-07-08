const baseURL = 'http://localhost:3000/api';

async function updateUI(pet) {
  try {
    const healthText = `${pet.health}%`;
    const happinessText = `${pet.happiness}%`;

    // Update UI elements
    document.getElementById('health').textContent = `Health: ${healthText}`;
    document.getElementById('happiness').textContent = `Happiness: ${happinessText}`;
    document.getElementById('name').textContent = pet.name;

    document.getElementById('healthProgress').value = pet.health;
    document.getElementById('happinessProgress').value = pet.happiness;

    // Check if the pet is dead
    if (pet.health === 0 || pet.happiness === 0) {
      handlePetDeath();
    }
  } catch (error) {
    console.error('Error updating UI:', error);
  }
}

async function fetchPetData() {
  try {
    const response = await fetch(`${baseURL}/pet`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const petData = await response.json();
    updateUI(petData);
  } catch (error) {
    console.error('Error fetching pet data:', error);
  }
}

async function createNewPet() {
  try {
    const newPet = { name: 'New Pet', health: 100, happiness: 100 };
    const response = await fetch(`${baseURL}/new-pet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPet)
    });

    if (!response.ok) {
      throw new Error('Failed to create a new pet');
    }
    
    // Fetch new pet data and update UI
    fetchPetData();
    
    // Reload the page to reset the UI
    window.location.reload();
  } catch (error) {
    console.error('Error creating a new pet:', error);
  }
}

async function decreaseValues() {
  try {
    // Initial delay before starting to decrease values
    setTimeout(async () => {
      // Repeat the decrease process every 10 seconds
      setInterval(async () => {
        const response = await fetch(`${baseURL}/pet`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const petData = await response.json();

        // Decrease health and happiness
        const newHealth = Math.max(0, petData.health - 10);
        const newHappiness = Math.max(0, petData.happiness - 10);

        // Send update request to server
        const updateResponse = await fetch(`${baseURL}/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ health: newHealth, happiness: newHappiness, name: petData.name })
        });

        if (!updateResponse.ok) {
          throw new Error('Update request failed');
        }

        // Update UI with new values
        updateUI({ health: newHealth, happiness: newHappiness, name: petData.name });
      }, 10000); // Repeat every 10 seconds
    }, 10000); 
  } catch (error) {
    console.error('Error decreasing values:', error);
  }
}

async function increaseHappiness() {
  try {
    const response = await fetch(`${baseURL}/pet`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const petData = await response.json();

    // Increase happiness
    const newHappiness = Math.min(100, petData.happiness + 10);

    // Send update request to server
    const updateResponse = await fetch(`${baseURL}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ health: petData.health, happiness: newHappiness, name: petData.name })
    });

    if (!updateResponse.ok) {
      throw new Error('Update request failed');
    }

    // Update UI with new values
    updateUI({ health: petData.health, happiness: newHappiness, name: petData.name });
  } catch (error) {
    console.error('Error increasing happiness:', error);
  }
}

async function increaseHealth() {
  try {
    const response = await fetch(`${baseURL}/pet`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const petData = await response.json();

    // Increase health
    const newHealth = Math.min(100, petData.health + 10);

    // Send update request to server
    const updateResponse = await fetch(`${baseURL}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ health: newHealth, happiness: petData.happiness, name: petData.name })
    });

    if (!updateResponse.ok) {
      throw new Error('Update request failed');
    }

    // Update UI with new values
    updateUI({ health: newHealth, happiness: petData.happiness, name: petData.name });
  } catch (error) {
    console.error('Error increasing health:', error);
  }
}

function handlePetDeath() {
  // Replace the container content with a death message
  const container = document.querySelector('.container');
  container.innerHTML = `
    <div class="death-message">
      <h1>Your pet has died</h1>
      <img id="petImg" src="crispy_gaina.jpg" alt="Pet">
      <button id="newPetBtn">Get a new pet</button>
    </div>
  `;

  // Add event listener to the new pet button
  document.getElementById('newPetBtn').addEventListener('click', createNewPet);
}

// Event listener when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add event listeners to the play and feed buttons
  document.getElementById('playBtn').addEventListener('click', increaseHappiness);
  document.getElementById('feedBtn').addEventListener('click', increaseHealth);
  
  // Fetch initial pet data, start decreasing values and update UI
  fetchPetData();
  decreaseValues();
});
