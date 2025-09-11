"use client";

import { SecondaryBlockTitle } from "@/components/molecules/titleSyles/Title";
import IngredientTable from "@/components/organism/ingredientTable/IngredientTable";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import HealthBenefits from "./HealthBenefits";
import FooterCtaCard from "@/components/organism/footerCtaCard/FooterCtaCard";
import FooterBannerCta from "./FooterBannerCta";
import FaqSection from "./FaqSection";
import { useSearchParams } from "next/navigation";

// Define the content for each meal type
const mealContent = {
  dog: {
    beef: {
      title1: "A Hearty Beef Feast,",
      title2: "Straight from The Farm",
      description:
        "Our Beef Bowl is made up of 85% lean ground beef and nutrient-rich beef liver, is a protein-packed feast designed to fuel your dog's lifestyle enhanced with fresh carrots and spinach for fiber and antioxidants supporting healthy muscles, digestion, and a shiny coat.",
      ingredients: [
        {
          image: "/images/NewLeanGroundBeefMeal.webp",
          name: "85% Lean Ground Beef",
        },
        { image: "/images/BeefLiverMeal.webp", name: "Beef Liver" },
        { image: "/images/CarrotMeal.webp", name: "Carrots" },
        { image: "/images/SpinachMeal.webp", name: "Spinach" },
        { image: "/images/EggYolkMeal.webp", name: "Whole Egg" },
        { image: "/images/CodLiverOilMeal.webp", name: "Cod Liver Oil" },
        { image: "/images/IonizedSaltMeal.webp", name: "Iodine" },
        { image: "/images/DriedKelpMeal.webp", name: "Kelp" },
        { image: "/images/VitaminsMeal.webp", name: "Vitamins & Minerals" },
      ],
      healthBenefits: {
        paragraph:
          "A protein-packed beef meal rich in iron, omega-3s, and essential nutrients to support strong muscles, healthy digestion, and a vibrant coat.",
        benefits: [
          {
            icon: "/icons/HeartHealth.webp",
            title: "Heart Health",
            description:
              "Rich in Coenzyme, aiding heart health and cellular energy production.",
          },
          {
            icon: "/icons/EyeHealth.webp",
            title: "Eye Health Booster",
            description:
              "Spinach, a natural source of lutein and beta-carotene, prevents vision issues.",
          },
          {
            icon: "/icons/AntiInflammatory.webp",
            title: "Anti-Inflammatory",
            description:
              "Antioxidants and omega-3s from carrots and cod liver oil reduce inflammation.",
          },
          {
            icon: "/icons/Cognitive.webp",
            title: "Cognitive and Nervous System",
            description: "Choline from egg yolks support brain development.",
          },
        ],
      },
    },
    chicken: {
      title1: "Fresh-Off-the-Coop",
      title2: "Chicken in Every Bite",
      description:
        "Our Chicken Bowl combines gently cooked chicken, nutrient-rich liver, and wholesome vegetables for a balanced, flavorful meal. Packed with essential vitamins, omega-3s, and natural calcium, it supports strong bones, digestion, and a healthy coat. Perfect nutrition to keep your dog thriving",
      ingredients: [
        {
          image: "/images/ChickenBreastMeal.webp",
          name: "Light & Dark Chicken",
        },
        { image: "/images/BeefLiverMeal.webp", name: "Chicken Liver" },
        { image: "/images/CauliFlowerMeal.webp", name: "Cauliflower" },
        { image: "/images/ButternutSquashMeal.webp", name: "Squash" },
        { image: "/images/EggYolkMeal.webp", name: "Whole Egg" },
        { image: "/images/CodLiverOilMeal.webp", name: "Cod Liver Oil" },
        { image: "/images/YeastMeal.webp", name: "Yeast" },
        { image: "/images/DriedKelpMeal.webp", name: "Kelp" },
        { image: "/images/VitaminsMeal.webp", name: "Vitamins & Minerals" },
      ],
      healthBenefits: {
        paragraph:
          "A protein-packed meal rich in iron, fiber, and omega-3s to support strong muscles, healthy digestion, and a shiny coat.",
        benefits: [
          {
            icon: "/icons/BalancedProtein.webp",
            title: "Balanced Protein & Fats",
            description:
              "White and dark chicken meat provides amino acids and healthy fats for sustained energy.",
          },
          {
            icon: "/icons/GutFriendly.webp",
            title: "Gut-Friendly Nutrition",
            description:
              "Butternut squash and cauliflower offer fiber and prebiotics for smooth digestion and gut health.",
          },
          {
            icon: "/icons/ShinyCoat.webp",
            title: "Shiny Coat & Strong Joints",
            description:
              "Omega-3s from cod liver oil and egg yolk nourish the skin, coat, and joints.",
          },
          {
            icon: "/icons/NaturalDetox.webp",
            title: "Natural Detox & Immunity",
            description:
              "Kelp and nutritional yeast deliver trace minerals and antioxidants to support immune function and metabolism.",
          },
        ],
      },
    },
    lamb: {
      title1: "Grass-Fed Lamb,",
      title2: "Shepherd-Approved",
      description:
        "Our Lamb Bowl is a delicious blend of lean lamb and liver, with sweet potatoes and broccoli to add fiber, antioxidants, and natural sweetness to every bite. This recipe offers a nutrient-dense and flavorful experience for your dog. With every bowl, your dog gets hearty, satisfying nutrition designed to keep them thriving.",
      ingredients: [
        {
          image: "/images/LeanGroundLambMeal.webp",
          name: "85% Lean Ground Lamb",
        },
        { image: "/images/BeefLiverMeal.webp", name: "Lamb Liver" },
        { image: "/images/SweetPotatoMeal.webp", name: "Sweet Potato" },
        { image: "/images/BroccoliMeal.webp", name: "Broccoli" },
        { image: "/images/EggYolkMeal.webp", name: "Whole Egg" },
        { image: "/images/HempSeedMeal.webp", name: "Hempseed" },
        { image: "/images/CodLiverOilMeal.webp", name: "Cod Liver Oil" },
        { image: "/images/YeastMeal.webp", name: "Yeast" },
        { image: "/images/VitaminsMeal.webp", name: "Vitamins & Minerals" },
      ],
      healthBenefits: {
        paragraph:
          "A nutrient-dense recipe ideal for sensitive dogs, promoting joint health, immune function, and balanced metabolism with anti-inflammatory and thyroid-supporting ingredients.",
        benefits: [
          {
            icon: "/icons/ShinyCoat.webp",
            title: "Joint Support",
            description:
              "Lamb, a natural source of conjugated linoleic acid, reduces supports healthy joints  for active or aging dogs.",
          },
          {
            icon: "/icons/GutFriendly.webp",
            title: "Sensitive Stomachs",
            description:
              "Less likely to trigger allergies or sensitivities, lamb is perfect for dogs with dietary restrictions.",
          },
          {
            icon: "/icons/NaturalDetox.webp",
            title: "Immune-Boosting",
            description:
              "Sweet potatoes and broccoli deliver high levels of antioxidants, vitamins C and E, and beta-carotene.",
          },
          {
            icon: "/icons/Thyroid.webp",
            title: "Thyroid and Metabolic Health",
            description:
              "Iodine rich kelp supports thyroid function, helping to regulate metabolism.",
          },
        ],
      },
    },
  },
  cat: {
    beef: {
      title1: "Prime Beef",
      title2: "Banquet",
      description:
        "Crafted with 85 % lean ground beef, taurine-rich beef heart, and nutrient-dense beef liver, our Beef Bowl for Cats delivers the species-appropriate protein and heme iron your carnivore craves. Perfectly balanced minerals and calcium from eggshell powder",
      ingredients: [
        {
          image: "/images/NewLeanGroundBeefMeal.webp",
          name: "85% Lean Ground Beef",
        },
        { image: "/images/BeefLiverMeal.webp", name: "Beef Liver" },
        { image: "/images/BeefHeartMeal.webp", name: "Beef Heart" },
        // { image: "/images/SpinachMeal.webp", name: "Spinach" },
        { image: "/images/EggYolkMeal.webp", name: "Whole Egg" },
        { image: "/images/SweetRedPepperMeal.webp", name: "Sweet Peppers" },
        { image: "/images/CarrotMeal.webp", name: "Carrots" },
        { image: "/images/HempSeedMeal.webp", name: "Hempseed" },
        { image: "/images/VitaminsMeal.webp", name: "Vitamins & Minerals" },
        { image: "/images/SeasoningMeal.webp", name: "Seasoning" },
      ],
      healthBenefits: {
        paragraph:
          "A protein-packed meal rich in iron, fiber, and omega-3s to support strong muscles, healthy digestion, and a shiny coat.",
        benefits: [
          {
            icon: "/icons/HeartHealth.webp",
            title: "Heart Health",
            description:
              "Rich in Coenzyme, aiding heart health and cellular energy production.",
          },
          {
            icon: "/icons/EyeHealth.webp",
            title: "Eye Health Booster",
            description:
              "Spinach, a natural source of lutein and beta-carotene, prevents vision issues.",
          },
          {
            icon: "/icons/AntiInflammatory.webp",
            title: "Anti-Inflammatory",
            description:
              "Antioxidants and omega-3s from carrots and cod liver oil reduce inflammation.",
          },
          {
            icon: "/icons/Cognitive.webp",
            title: "Cognitive and Nervous System",
            description: "Choline from egg yolks support brain development.",
          },
        ],
      },
    },
    chicken: {
      title1: "Coop-Crafted",
      title2: "Feast",
      description:
        "Juicy dark-meat chicken and hearts—chicken liver adds vitamin A and iron, while an egg adds choline. We fold in tiny flecks of sweet pepper and broccoli for fiber and antioxidant, then lace the mix with hempseed for a purr-worthy omega-6 glow.",
      ingredients: [
        { image: "/images/ChickenBreastMeal.webp", name: "Dark Chicken" },
        { image: "/images/BeefLiverMeal.webp", name: "Chicken Liver" },
        { image: "/images/ChickenHeartMeal.webp", name: "Chicken Heart" },
        { image: "/images/BroccoliMeal.webp", name: "Broccoli" },
        { image: "/images/EggYolkMeal.webp", name: "Whole Egg" },
        { image: "/images/SweetRedPepperMeal.webp", name: "Sweet Peppers" },
        { image: "/images/VitaminsMeal.webp", name: "Vitamins & Minerals" },
        { image: "/images/SeasoningMeal.webp", name: "Seasoning" },
        { image: "/images/ThymeMeal.webp", name: "Thyme" },
      ],
      healthBenefits: {
        paragraph:
          "A protein-packed meal rich in iron, fiber, and omega-3s to support strong muscles, healthy digestion, and a shiny coat.",
        benefits: [
          {
            icon: "/icons/BalancedProtein.webp",
            title: "Balanced Protein & Fats",
            description:
              "White and dark chicken meat provides amino acids and healthy fats for sustained energy.",
          },
          {
            icon: "/icons/GutFriendly.webp",
            title: "Gut-Friendly Nutrition",
            description:
              "Butternut squash and cauliflower offer fiber and prebiotics for smooth digestion and gut health.",
          },
          {
            icon: "/icons/ShinyCoat.webp",
            title: "Shiny Coat & Strong Joints",
            description:
              "Omega-3s from cod liver oil and egg yolk nourish the skin, coat, and joints.",
          },
          {
            icon: "/icons/NaturalDetox.webp",
            title: "Natural Detox & Immunity",
            description:
              "Kelp and nutritional yeast deliver trace minerals and antioxidants to support immune function and metabolism.",
          },
        ],
      },
    },
    lamb: {
      title1: "Grass-Fed",
      title2: "Gourmet Delight",
      description:
        "Succulent ground lamb with liver to supply iron and B-vitamins—ideal for cats who need a break from poultry. With zucchini ribbons and broccoli to aid digestion. A spoonful of cod-liver oil delivers sea-sourced EPA/DHA and vitamin D.Dual calcium sources ",
      ingredients: [
        {
          image: "/images/LeanGroundLambMeal.webp",
          name: "85% Lean Ground Lamb",
        },
        { image: "/images/BeefLiverMeal.webp", name: "Lamb Liver" },
        { image: "/images/ButternutSquashMeal.webp", name: "Squash" },
        { image: "/images/BroccoliMeal.webp", name: "Broccoli" },
        { image: "/images/HempSeedMeal.webp", name: "Hempseed" },
        { image: "/images/EggYolkMeal.webp", name: "Whole Egg" },
        { image: "/images/VitaminsMeal.webp", name: "Vitamins & Minerals" },
        { image: "/images/SeasoningMeal.webp", name: "Seasoning" },
        { image: "/images/ThymeMeal.webp", name: "Thyme" },
      ],
      healthBenefits: {
        paragraph:
          "A nutrient-dense recipe ideal for sensitive dogs, promoting joint health, immune function, and balanced metabolism with anti-inflammatory and thyroid-supporting ingredients.",
        benefits: [
          {
            icon: "/icons/ShinyCoat.webp",
            title: "Joint Support",
            description:
              "Lamb, a natural source of conjugated linoleic acid, reduces supports healthy joints  for active or aging dogs.",
          },
          {
            icon: "/icons/GutFriendly.webp",
            title: "Sensitive Stomachs",
            description:
              "Less likely to trigger allergies or sensitivities, lamb is perfect for dogs with dietary restrictions.",
          },
          {
            icon: "/icons/NaturalDetox.webp",
            title: "Immune-Boosting",
            description:
              "Sweet potatoes and broccoli deliver high levels of antioxidants, vitamins C and E, and beta-carotene.",
          },
          {
            icon: "/icons/Thyroid.webp",
            title: "Thyroid and Metabolic Health",
            description:
              "Iodine rich kelp supports thyroid function, helping to regulate metabolism.",
          },
        ],
      },
    },
  },
};

const footerCtaCatData = {
  mealTransition: {
    title: "Meal",
    highlight: "Transition",
    paragraph:
      "Gradually introduce our fresh meals to ensure a smooth adjustment and lasting benefits for your furry child",
    imageSrc: "/images/meal-transition.webp",
  },
  petFood: {
    title: "Looking for",
    highlight: "Dog Food?",
    paragraph:
      "Check out our nutrient-rich and irresistibly delicious dog Bowls for optimal feline health and wellness!",
    imageSrc: "/images/dog-cta.webp",
    link: "/meals?pet=dog&protein=beef",
  },
};
const footerCtaDogData = {
  mealTransition: {
    title: "Meal",
    highlight: "Transition",
    paragraph:
      "Gradually introduce our fresh meals to ensure a smooth adjustment and lasting benefits for your furry child",
    imageSrc: "/images/meal-transition.webp",
  },
  petFood: {
    title: "Looking for",
    highlight: "Cat Food?",
    paragraph: `Come check out our nutrient-rich, irresistibly delicious bowls for cats and dogs!
                Made with love, our recipes fuel optimal health, happiness, and tail wags for your furry babies!`,
    imageSrc: "/images/cat.webp",
    link: "/meals?pet=cat&protein=beef",
  },
};

export default function MealBody() {
  const searchParams = useSearchParams();
  const pet = searchParams.get("pet");
  const protein = searchParams.get("protein");

  const [selectedPet, setSelectedPet] = useState<"dog" | "cat">(
    pet && ["dog", "cat"].includes(pet) ? (pet as "dog" | "cat") : "dog"
  );
  // State to manage the current selected meal type
  const [selectedMeal, setSelectedMeal] = useState<"beef" | "chicken" | "lamb">(
    protein && ["beef", "chicken", "lamb"].includes(protein)
      ? (protein as "beef" | "chicken" | "lamb")
      : "beef"
  );

  useEffect(() => {
    if (pet && ["dog", "cat"].includes(pet)) {
      setSelectedPet(pet as "dog" | "cat");
    }
  }, [pet]);

  // Sync URL changes with state
  useEffect(() => {
    if (protein && ["beef", "chicken", "lamb"].includes(protein)) {
      setSelectedMeal(protein as "beef" | "chicken" | "lamb");
    }
  }, [protein]);

  // Function to handle tab switching
  const handleMealSwitch = (meal: "beef" | "chicken" | "lamb") => {
    setSelectedMeal(meal);
    window.history.pushState({}, "", `?pet=${pet}&protein=${meal}`);
  };

  // Get the current meal's content
  const currentMeal = mealContent[selectedPet][selectedMeal];

  return (
    <div className="w-full mt-[-3%] sm:mt-[-1.4%]">
      {/* Tab Buttons */}
      {/* <div className="flex gap-[var(--space-8-13)] mb-[var(--space-97-130)] w-fit mx-auto relative z-20">
        <Button
          variant={selectedMeal === "beef" ? "primaryBtn" : "secondaryBtn"}
          onClick={() => handleMealSwitch("beef")}
          
        >
          Beef Bowl
        </Button>
        <Button
          variant={selectedMeal === "chicken" ? "primaryBtn" : "secondaryBtn"}
          onClick={() => handleMealSwitch("chicken")}
        >
          Chicken Bowl
        </Button>
        <Button
          variant={selectedMeal === "lamb" ? "primaryBtn" : "secondaryBtn"}
          onClick={() => handleMealSwitch("lamb")}
        >
          Lamb Bowl
        </Button>
      </div> */}

      <div className="flex gap-2 sm:gap-[var(--space-8-13)]  w-fit mx-auto z-20 sticky top-5 max-sm:px-5">
        <Button
          variant={selectedMeal === "beef" ? "primaryBtn" : "secondaryBtn"}
          className="max-sm:!px-3"
          onClick={() => {
            handleMealSwitch("beef");
            window.scrollTo({ top: 150, behavior: "smooth" });
            const element = document.getElementById("top-wrapper");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          {/* Beef Bowl */}
          <span className="max-sm:text-sm">Beef Bowl</span>
        </Button>
        <Button
          variant={selectedMeal === "chicken" ? "primaryBtn" : "secondaryBtn"}
          className="max-sm:!px-3"
          onClick={() => {
            handleMealSwitch("chicken");
            const element = document.getElementById("top-wrapper");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          {/* Chicken Bowl */}
          <span className="max-sm:text-sm">Chicken Bowl</span>
        </Button>
        <Button
          variant={selectedMeal === "lamb" ? "primaryBtn" : "secondaryBtn"}
          className="max-sm:!px-3"
          onClick={() => {
            handleMealSwitch("lamb");
            const element = document.getElementById("top-wrapper");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          {/* Lamb Bowl */}
          <span className="max-sm:text-sm">Lamb Bowl</span>
        </Button>
      </div>

      <div
        className="w-[90%] pt-[var(--space-97-130)] sm:w-[62%] mx-auto mb-[var(--space-50-67)]"
        id="top-wrapper"
      >
        <Image
          src="/images/meal-bowl.webp"
          alt="meal bowl"
          className="!static hidden sm:block inset-0 w-full !h-full object-cover object-center"
          fill
          priority
        />
        <Image
          src="/images/meal-bowl-mob.webp"
          alt="meal bowl"
          className="!static block sm:hidden inset-0 w-full !h-full object-cover object-center"
          fill
          priority
        />
      </div>

      {/* Typography Section */}
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <SecondaryBlockTitle
        dogOrCat={pet as "dog" | "cat"}
        title={currentMeal.title1}
        highlight={currentMeal.title2}
        paragraph={currentMeal.description}
      />
      {/* </Suspense> */}

      {/* Ingredient Table */}
      <IngredientTable ingredients={currentMeal.ingredients} />

      {/* Health Benefits */}
      <HealthBenefits
        paragraph={currentMeal.healthBenefits.paragraph}
        benefits={currentMeal.healthBenefits.benefits}
      />
      <div className="py-(--space-120-180)">
        <FooterBannerCta />
      </div>

      <div>
        <FaqSection />
      </div>

      <div className="py-(--space-120-180)">
        <FooterCtaCard
          mealTransition={
            selectedPet === "dog"
              ? footerCtaDogData.mealTransition
              : footerCtaCatData.mealTransition
          }
          petFood={
            selectedPet === "dog"
              ? footerCtaDogData.petFood
              : footerCtaCatData.petFood
          }
        />
      </div>
    </div>
  );
}
