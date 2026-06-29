export type Pet = {
  color: string;
  created_at?: string;
  id: string;
  memo: string | null;
  name: string;
  species: string;
  updated_at?: string;
  user_id?: string;
};

export type PetFormValues = {
  name: string;
  species: string;
  customSpecies: string;
  color: string;
  memo: string;
};
