import type { Pet } from "../types";

type PetListProps = {
  pets: Pet[];
};

export function PetList({ pets }: PetListProps) {
  if (pets.length === 0) {
    return (
      <section className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">아직 등록된 반려동물이 없습니다</h2>
        <p className="mt-2 text-sm leading-6 text-[#746f66]">
          왼쪽 폼에서 이름과 종류를 입력하면 이곳에 카드가 생깁니다.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">등록된 반려동물</h2>
        <span className="rounded-md bg-[#eaf2e5] px-3 py-1 text-sm font-bold text-[#2f5d50]">
          {pets.length}마리
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {pets.map((pet) => (
          <article
            className="rounded-md border border-[#eee7dc] bg-[#fbfaf7] p-4"
            key={pet.id}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-1 h-4 w-4 rounded-full"
                style={{ backgroundColor: pet.color }}
              />
              <div>
                <h3 className="text-lg font-bold">{pet.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[#68735f]">
                  {pet.species}
                </p>
                {pet.memo ? (
                  <p className="mt-3 text-sm leading-6 text-[#746f66]">
                    {pet.memo}
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
