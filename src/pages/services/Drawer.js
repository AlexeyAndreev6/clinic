import "./services.css";
export default function Drawer({onRemove, total, items = [] }){
    return (
    <div className="formcalc">
      <div className="calc"><span>Результаты расчетов</span></div>
      {items.map((obj) => (
        <div key={obj.id}>
        <p> {obj.nameServices} - {obj.price} ₽</p>
        <img onClick={() => onRemove(obj.id)} className="removeBtn"
                    src="img/btn-remove.svg"
                    alt="Remove"
                  />
        </div>
      ))}
      <div className="calc"><span>Итого: {total} ₽</span></div>
      </div>
    )
}