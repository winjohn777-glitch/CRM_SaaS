// Construction Industry Modules
export { JobCostingModule, jobCostingModule } from './job-costing';
export { CrewSchedulingModule, crewSchedulingModule } from './crew-scheduling';
export { MaterialTrackingModule, materialTrackingModule } from './material-tracking';

// Register all construction modules
import { moduleRegistry } from '../registry';
import { jobCostingModule } from './job-costing';
import { crewSchedulingModule } from './crew-scheduling';
import { materialTrackingModule } from './material-tracking';

export function registerConstructionModules(): void {
  moduleRegistry.register(jobCostingModule);
  moduleRegistry.register(crewSchedulingModule);
  moduleRegistry.register(materialTrackingModule);
}
